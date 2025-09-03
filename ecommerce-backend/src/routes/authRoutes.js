const express = require('express');
const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');
const { validateRegistration, validateLogin, validateOTP } = require('../utils/validators');

const router = express.Router();

// Route for user registration
router.post('/register', validateRegistration, registerUser);

// Route for user login
router.post('/login', validateLogin, loginUser);

// Route for OTP verification
router.post('/verify-otp', validateOTP, verifyOTP);

module.exports = router;