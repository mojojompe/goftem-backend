// src/services/otpService.js

const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('./emailService');

const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email) => {
    const otp = generateOTP();
    // Save OTP to the user's record in the database (you may want to set an expiration time)
    await User.updateOne({ email }, { otp });

    // Send OTP email
    const subject = 'Your OTP Code';
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #ffb13f;">Your OTP Code</h2>
            <p>Dear User,</p>
            <p>Your OTP code for verification is <strong>${otp}</strong>.</p>
            <p>Please use this code to complete your registration.</p>
            <p>Thank you!</p>
        </div>
    `;
    await emailService.sendEmail(email, subject, html);
};

const verifyOTP = async (email, otp) => {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    // Optionally, clear the OTP after verification
    await User.updateOne({ email }, { otp: null });
    return true;
};

module.exports = {
    sendOTP,
    verifyOTP,
};