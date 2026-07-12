const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Not authorized, no token', {});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return sendResponse(res, 401, false, 'User not found', {});
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, false, 'Invalid token', {});
    }
    return sendResponse(res, 500, false, 'Server error', {});
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return sendResponse(res, 401, false, 'Not authorized', {});
  }

  if (!allowedRoles.includes(req.user.role)) {
    return sendResponse(res, 403, false, 'Access denied for this role', {});
  }

  next();
};

module.exports = { protect, authorizeRoles };
