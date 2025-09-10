const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Load email configuration from the environment variables
const { EMAIL_USER, EMAIL_PASS } = process.env;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Change this to your email service
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Function to send a welcome email
const sendWelcomeEmail = (to, name) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Welcome to GOFTEM STORES!',
        html: fs.readFileSync(path.join(__dirname, '../templates/welcomeEmail.html'), 'utf8').replace('{{name}}', name),
    };

    return transporter.sendMail(mailOptions);
};

// Function to send an OTP email
const sendOtpEmail = (to, otp) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Your OTP Code',
        html: fs.readFileSync(path.join(__dirname, '../templates/otpEmail.html'), 'utf8').replace('{{otp}}', otp),
    };

    return transporter.sendMail(mailOptions);
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = (to, orderDetails) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Payment Confirmation',
        html: fs.readFileSync(path.join(__dirname, '../templates/paymentConfirmationEmail.html'), 'utf8').replace('{{orderDetails}}', orderDetails),
    };

    return transporter.sendMail(mailOptions);
};

// Function to send checkout email
const sendCheckoutEmail = (to, orderSummary) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Checkout Successful',
        html: fs.readFileSync(path.join(__dirname, '../templates/checkoutEmail.html'), 'utf8').replace('{{orderSummary}}', orderSummary),
    };

    return transporter.sendMail(mailOptions);
};

// Function to notify users about new stock
const notifyNewStockEmail = (to, productName) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'New Stock Available!',
        html: fs.readFileSync(path.join(__dirname, '../templates/newStockEmail.html'), 'utf8').replace('{{productName}}', productName),
    };

    return transporter.sendMail(mailOptions);
};

// Export the email service functions
module.exports = {
    sendWelcomeEmail,
    sendOtpEmail,
    sendPaymentConfirmationEmail,
    sendCheckoutEmail,
    notifyNewStockEmail,
};