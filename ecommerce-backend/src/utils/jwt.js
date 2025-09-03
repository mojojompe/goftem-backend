const jwt = require('jsonwebtoken');

// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Change this to a secure secret in production

// Function to generate a JWT token
const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // Returns the decoded payload if verification is successful
    } catch (error) {
        return null; // Returns null if verification fails
    }
};

module.exports = {
    generateToken,
    verifyToken,
};