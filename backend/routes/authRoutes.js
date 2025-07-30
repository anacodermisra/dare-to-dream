const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user registration (Participant)
router.post('/register', authController.register);

// Route for user login (Admin or Participant)
router.post('/login', authController.loginUser);

module.exports = router;
