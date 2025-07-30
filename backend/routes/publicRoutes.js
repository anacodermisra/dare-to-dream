const express = require('express');
const router = express.Router();
const Settings = require('../models/settingsModel');

// ✅ GET enabled verticals (for participants)
router.get('/verticals', async (req, res) => {
  try {
    const config = await Settings.findOne();
    if (!config || !config.verticals) {
      return res.json([]);
    }

    const enabledVerticals = config.verticals
      .filter(v => v.enabled)
      .map(v => v.name);

    res.json(enabledVerticals);
  } catch (err) {
    console.error("❌ Error fetching verticals:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
