// src/controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpService = require("../services/otpService");
const emailService = require("../services/emailService");

// User Registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Auto-elevate admin based on env configuration
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: isAdminEmail ? "admin" : undefined,
      isVerified: isAdminEmail ? true : undefined,
    });
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
      message: isAdminEmail
        ? "Admin registered successfully."
        : "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure admin role for configured admin email
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    if (isAdminEmail && user.role !== "admin") {
      user.role = "admin";
      user.isVerified = true;
      await user.save();
    }

    // Block login if not verified (except for admin email)
    if (!user.isVerified && !isAdminEmail) {
      return res
        .status(403)
        .json({ message: "Please verify your email with the OTP." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Send OTP for email verification
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = otpService.generateOtp();
    user.otp = otp;
    await user.save();

    // Send OTP email
    await emailService.sendOtpEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
