const express = require("express");
const {
  register,
  login,
  verifyOtp,
  sendOtp,
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  validate,
} = require("../utils/validators");

const router = express.Router();

// Route for user registration
router.post("/register", registerValidator, validate, register);

// Route for user login
router.post("/login", loginValidator, validate, login);

// Route for sending OTP
router.post("/send-otp", sendOtp);

// Route for OTP verification
router.post("/verify-otp", validate, verifyOtp);

module.exports = router;
