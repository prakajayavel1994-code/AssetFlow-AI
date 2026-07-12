const express = require('express');
const router = express.Router();
const { getReportSummary, getAssetReport, getMaintenanceReport, getEmployeeReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReportSummary);
router.get('/assets', protect, getAssetReport);
router.get('/maintenance', protect, getMaintenanceReport);
router.get('/employees', protect, getEmployeeReport);

module.exports = router;
