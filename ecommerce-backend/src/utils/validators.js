// src/utils/validators.js

const { body, validationResult } = require('express-validator');

// Validator for user registration
const registerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validator for user login
const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Function to validate request data
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validators for OTP flow
const sendOtpValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

const verifyOtpValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 4, max: 8 }).withMessage('OTP is required')
];

module.exports = {
    registerValidator,
    loginValidator,
    validate,
    sendOtpValidator,
    verifyOtpValidator,
};