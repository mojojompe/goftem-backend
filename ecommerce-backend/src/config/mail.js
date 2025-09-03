const nodemailer = require('nodemailer');

// Create a transporter object using SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP host from environment variables
    port: process.env.SMTP_PORT, // SMTP port from environment variables
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // SMTP user from environment variables
        pass: process.env.SMTP_PASS, // SMTP password from environment variables
    },
});

// Function to send a welcome email
const sendWelcomeEmail = (to, name) => {
    const mailOptions = {
        from: process.env.SMTP_USER, // sender address
        to, // list of receivers
        subject: 'Welcome to Our E-commerce Platform!',
        html: `<div style="color: #ffb13f;">
                   <h1>Welcome, ${name}!</h1>
                   <p>Thank you for joining us. We are excited to have you on board!</p>
                   <p>Best Regards,<br>Your E-commerce Team</p>
                   <img src="path/to/logo" alt="Logo" />
               </div>`,
    };

    return transporter.sendMail(mailOptions);
};

// Function to send an OTP email
const sendOtpEmail = (to, otp) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'Your OTP Code',
        html: `<div style="color: #ffb13f;">
                   <h1>Your OTP Code</h1>
                   <p>Your OTP code is: <strong>${otp}</strong></p>
                   <p>Please use this code to verify your account.</p>
                   <img src="path/to/logo" alt="Logo" />
               </div>`,
    };

    return transporter.sendMail(mailOptions);
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = (to, orderId) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'Payment Confirmation',
        html: `<div style="color: #ffb13f;">
                   <h1>Payment Confirmation</h1>
                   <p>Your payment for order ID: <strong>${orderId}</strong> has been confirmed.</p>
                   <p>Thank you for your purchase!</p>
                   <img src="path/to/logo" alt="Logo" />
               </div>`,
    };

    return transporter.sendMail(mailOptions);
};

// Function to send checkout email
const sendCheckoutEmail = (to, orderDetails) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'Checkout Successful',
        html: `<div style="color: #ffb13f;">
                   <h1>Checkout Successful</h1>
                   <p>Your order has been placed successfully. Here are the details:</p>
                   <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
                   <img src="path/to/logo" alt="Logo" />
               </div>`,
    };

    return transporter.sendMail(mailOptions);
};

// Function to notify users about new stock
const sendNewStockEmail = (to, productName) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'New Stock Alert!',
        html: `<div style="color: #ffb13f;">
                   <h1>New Stock Available!</h1>
                   <p>We are excited to inform you that ${productName} is back in stock!</p>
                   <p>Check it out on our website.</p>
                   <img src="path/to/logo" alt="Logo" />
               </div>`,
    };

    return transporter.sendMail(mailOptions);
};

// Export the email functions
module.exports = {
    sendWelcomeEmail,
    sendOtpEmail,
    sendPaymentConfirmationEmail,
    sendCheckoutEmail,
    sendNewStockEmail,
};