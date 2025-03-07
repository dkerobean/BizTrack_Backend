const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Protect routes
const protect = async (req, res, next) => {
  try {
    // Check for token in headers
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token.",
      error: error.message,
    });
  }
};

// Role-based authorization (e.g., admin, staff)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };