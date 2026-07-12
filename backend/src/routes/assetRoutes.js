const express = require('express');
const router = express.Router();
const { getAssets, getAssetById, createAsset, getAssetQr, updateAsset, deleteAsset, assetValidation } = require('../controllers/assetController');
const { validate } = require('../middleware/validateMiddleware');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('admin'), getAssets);
router.get('/:id/qr', protect, authorizeRoles('admin'), getAssetQr);
router.get('/:id', protect, authorizeRoles('admin'), getAssetById);
router.post('/', protect, authorizeRoles('admin'), assetValidation, validate, createAsset);
router.put('/:id', protect, authorizeRoles('admin'), assetValidation, validate, updateAsset);
router.delete('/:id', protect, authorizeRoles('admin'), deleteAsset);

module.exports = router;
