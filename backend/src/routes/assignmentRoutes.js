const express = require('express');
const router = express.Router();
const { assignAsset, returnAsset, getAssignmentHistory, assignmentValidation } = require('../controllers/assignmentController');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAssignmentHistory);
router.get('/history', protect, getAssignmentHistory);
router.post('/', protect, assignmentValidation, validate, assignAsset);
router.post('/assign', protect, assignmentValidation, validate, assignAsset);
router.put('/return/:id', protect, returnAsset);

module.exports = router;
