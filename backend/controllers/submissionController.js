const Submission = require('../models/submissionModel');
const path = require('path');

const submitIdea = async (req, res) => {
  console.log("🔥 Hit /submit route");

  try {
    console.log("📥 req.body:", req.body);

    if (!req.file) {
      console.log("🚫 No PDF file received");
      return res.status(400).json({ msg: 'PDF file is required' });
    }

    console.log("📎 Uploaded file:", req.file);

    const pdfUrl = `/uploads/${req.file.filename}`;

    const submissionData = {
      userId: req.user.id,
      name: req.body.name,
      category: req.body.category,
      vertical: req.body.innovation_vertical,
      projectTitle: req.body.projectTitle ,
      abstract: req.body.abstract,
      pdfUrl
    };

    console.log("🧾 Preparing to save:", submissionData);

    const submission = new Submission(submissionData);
    await submission.save();

    console.log("✅ Submission saved to DB");
    res.status(201).json({ msg: 'Submission successful', submission });

  } catch (err) {
    console.error('🔥 ERROR in submitIdea:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { submitIdea };
