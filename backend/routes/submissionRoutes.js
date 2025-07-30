const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose'); // <--- ADD THIS LINE TO IMPORT MONGOOSE

const { submitIdea } = require('../controllers/submissionController');
const { verifyToken } = require('../middleware/authMiddleware');
const Submission = require('../models/submissionModel');

// PDF storage config (no change needed)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/submission/submit (no change needed)
router.post('/submit', verifyToken, upload.single('pdf'), submitIdea);

// GET /api/submission/my
router.get('/my', verifyToken, async (req, res) => {
  try {
    // 💡 FIX: Convert req.user.id to a Mongoose ObjectId
    // This assumes req.user.id is a valid ObjectId string.
    const userIdAsObjectId = new mongoose.Types.ObjectId(req.user.id);

    console.log('Backend: Querying for userId (ObjectId):', userIdAsObjectId); // Added for debugging

    const submissions = await Submission.find({ userId: userIdAsObjectId }); // <--- USE THE CONVERTED ID HERE
    console.log('Backend: Fetched submissions for userId:', req.user.id, ':', submissions.length);

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching user submissions:', err);
    // You might want to check if the error is due to an invalid ObjectId string
    if (err.name === 'CastError' && err.path === '_id') {
      return res.status(400).json({ msg: 'Invalid User ID format' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;