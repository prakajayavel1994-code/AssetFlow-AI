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
    const user = await User.create({ fullName, email: normalizedEmail, password: hashedPassword, phone, role });

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
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials', {});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid credentials', {});
    }

    return sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return sendResponse(res, 200, true, 'Profile fetched', { user: req.user });
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

module.exports = { registerUser, loginUser, getProfile, authValidation, loginValidation };
