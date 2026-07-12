const express = require('express');
const router = express.Router();
const { getRecommendations, generateRecommendation, chat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getRecommendations);
router.post('/recommendations', protect, generateRecommendation);
router.post('/predict', protect, generateRecommendation);
router.post('/chat', protect, chat);

module.exports = router;
