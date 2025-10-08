// src/services/otpService.js

// Dedicated service for generating OTP values

const generateOtp = () => {
  // Generate a 6-digit OTP as a string
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateOtp,
};