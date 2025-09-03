const jwt = require('jsonwebtoken');

// Middleware to protect routes that require authentication
const authMiddleware = (req, res, next) => {
    // Get token from headers
    const token = req.headers['authorization']?.split(' ')[1];

    // If no token, return unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is not valid.' });
        }

        // Save user ID to request for use in other routes
        req.user = decoded.id;
        next();
    });
};

// Export the middleware
module.exports = authMiddleware;