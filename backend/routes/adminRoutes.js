
console.log("✅ adminRoutes loaded");


const express = require('express');
const router = express.Router();
const Submission = require('../models/submissionModel');
const Settings = require('../models/settingsModel'); // ✅ Correct model
const { verifyToken } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const csv = require('fast-csv');

// ✅ Admin-only middleware
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};

// ✅ GET all submissions
router.get('/submissions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ DELETE a submission
router.delete('/delete/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Submission.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    res.json({ msg: 'Submission deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting submission:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ DOWNLOAD all submissions as ZIP
router.get('/download/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find();
    const zipPath = path.join(__dirname, '../temp/all_submissions.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
      res.download(zipPath, 'all_submissions.zip', () => {
        fs.unlinkSync(zipPath); // cleanup
      });
    });

    archive.pipe(output);

    // 1. Add all PDFs
    submissions.forEach(sub => {
      if (sub.pdfUrl) {
        const filePath = path.join(__dirname, '../', sub.pdfUrl);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: `PDFs/${sub.name || 'user'}_${path.basename(filePath)}` });
        }
      }
    });

    // 2. Add metadata.csv
    const metadata = submissions.map(sub => ({
      Name: sub.name,
      Category: sub.category,
      Vertical: sub.vertical,
      Title: sub.projectTitle,
      Abstract: sub.abstract,
      Date: new Date(sub.submittedAt).toLocaleString()
    }));

    const csvPath = path.join(__dirname, '../temp/metadata.csv');
    const csvStream = csv.format({ headers: true });
    const csvWrite = fs.createWriteStream(csvPath);

    csvStream.pipe(csvWrite);
    metadata.forEach(row => csvStream.write(row));
    csvStream.end();

    csvWrite.on('finish', () => {
      archive.file(csvPath, { name: 'metadata.csv' });
      archive.finalize();
    });

  } catch (err) {
    console.error('❌ ZIP download error:', err);
    res.status(500).json({ msg: 'Failed to download submissions.' });
  }
});

// ✅ GET admin config (verticals + categories)
router.get('/config', verifyToken, verifyAdmin, async (req, res) => {
  console.log("🔥 HIT GET /config");
  try {
    let config = await Settings.findOne();
    if (!config) {
      config = await Settings.create({ categories: [], verticals: [] });
    }
    res.json(config);
  } catch (err) {
    console.error("❌ Error in GET /config:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/config', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { verticals } = req.body;

    let config = await Settings.findOne();
    if (!config) {
      config = await Settings.create({ categories: [], verticals });
    } else {
      config.verticals = verticals;
    }

    config.updatedAt = Date.now();
    await config.save();

    res.json({ msg: 'Updated successfully', verticals });
  } catch (err) {
    console.error("❌ Error in PATCH /config:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/test', (req, res) => {
  res.send('admin test route works');
});


router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const all = await Submission.find();

    const verticalCount = {};
    const categoryCount = {};

    all.forEach(sub => {
      verticalCount[sub.vertical] = (verticalCount[sub.vertical] || 0) + 1;
      categoryCount[sub.category] = (categoryCount[sub.category] || 0) + 1;
    });

    res.json({
      total: all.length,
      verticals: verticalCount,
      categories: categoryCount
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
