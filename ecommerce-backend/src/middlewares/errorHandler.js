module.exports = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      type: "ValidationError",
      message: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      type: "DuplicateError",
      message: "Duplicate value entered",
    });
  }

  // Handle jwt errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      type: "AuthError",
      message: "Invalid token",
    });
  }

  // Handle jwt expiration
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      type: "AuthError",
      message: "Token expired",
    });
  }

  // Set the response status code based on the error type
  const statusCode = err.statusCode || 500;

  // Send a JSON response with the error message
  res.status(statusCode).json({
    success: false,
    type: err.type || "ServerError",
    message: err.message || "Internal Server Error",
  });
};
