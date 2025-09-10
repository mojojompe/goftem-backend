const express = require("express");
const { register, login, verifyOtp } = require("../controllers/authController");
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

// Route for OTP verification
router.post("/verify-otp", validate, verifyOtp);

module.exports = router;
