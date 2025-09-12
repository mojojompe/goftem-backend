exports.adminMiddleware = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Please log in." });
  }

  // Check if the user has admin privileges
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message:
          "Forbidden. You do not have permission to access this resource.",
      });
  }

  // If the user is authenticated and is an admin, proceed to the next middleware or route handler
  next();
};
