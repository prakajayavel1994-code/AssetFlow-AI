const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendResponse(res, 400, false, 'User already exists', {});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedRole = String(role || '').trim().toLowerCase();
    const safeRole = normalizedRole === 'admin' ? 'admin' : 'employee';
    const user = await User.create({ fullName, email: normalizedEmail, password: hashedPassword, phone, role: safeRole });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token: generateToken(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const requestedRole = String(role || '').trim().toUpperCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials', {});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid credentials', {});
    }

    const expectedRole = requestedRole === 'ADMIN' ? 'admin' : requestedRole === 'EMPLOYEE' ? 'employee' : null;
    if (expectedRole && user.role !== expectedRole) {
      return sendResponse(res, 401, false, 'Access denied for the selected role', {});
    }

    const authUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
    };

    if (user.mustChangePassword) {
      return sendResponse(res, 200, true, 'Password change required', {
        user: authUser,
        token: generateToken(user),
        mustChangePassword: true,
      });
    }

    return sendResponse(res, 200, true, 'Login successful', {
      user: authUser,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return sendResponse(res, 200, true, 'Profile fetched', { user: req.user });
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', {});
    }

    if (user.mustChangePassword && user.temporaryPassword) {
      if (currentPassword !== user.temporaryPassword) {
        return sendResponse(res, 401, false, 'Current password is incorrect', {});
      }
    } else {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return sendResponse(res, 401, false, 'Current password is incorrect', {});
      }
    }

    if (!newPassword || String(newPassword).length < 6) {
      return sendResponse(res, 400, false, 'New password must be at least 6 characters', {});
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    user.temporaryPassword = undefined;
    await user.save();

    return sendResponse(res, 200, true, 'Password updated successfully', {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const authValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

module.exports = { registerUser, loginUser, getProfile, changePassword, authValidation, loginValidation, changePasswordValidation };
