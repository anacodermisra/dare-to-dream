const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  categories: [String],
  verticals: [
    {
      name: String,
      enabled: { type: Boolean, default: true }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
