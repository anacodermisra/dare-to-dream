const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,  // Name of participant
  category: String, // Individual / Startup / MSME
  vertical: String, // VLSI, AI/ML, etc.
  projectTitle: String,
  abstract: String,
  pdfPath: String, // File path to uploaded PDF
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', submissionSchema);

