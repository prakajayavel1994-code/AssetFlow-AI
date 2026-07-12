const express = require('express');
const router = express.Router();
const { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance, getUpcomingMaintenance, getCompletedMaintenance, maintenanceValidation } = require('../controllers/maintenanceController');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMaintenance);
router.get('/upcoming', protect, getUpcomingMaintenance);
router.get('/completed', protect, getCompletedMaintenance);
router.post('/', protect, maintenanceValidation, validate, createMaintenance);
router.put('/:id', protect, maintenanceValidation, validate, updateMaintenance);
router.delete('/:id', protect, deleteMaintenance);

module.exports = router;
