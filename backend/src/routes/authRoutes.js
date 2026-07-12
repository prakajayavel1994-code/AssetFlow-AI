const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, changePassword, authValidation, loginValidation, changePasswordValidation } = require('../controllers/authController');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/change-password', protect, changePasswordValidation, validate, changePassword);
router.get('/profile', protect, getProfile);

module.exports = router;
