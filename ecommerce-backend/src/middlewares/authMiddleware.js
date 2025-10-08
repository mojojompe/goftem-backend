const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes that require authentication
// Express middleware for authentication
exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader; // also allow raw token
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found for token" });
    }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
