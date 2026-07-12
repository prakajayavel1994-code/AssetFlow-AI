const express = require('express');
const router = express.Router();
const { getAssets, getAssetById, createAsset, getAssetQr, updateAsset, deleteAsset, assetValidation } = require('../controllers/assetController');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAssets);
router.get('/:id/qr', protect, getAssetQr);
router.get('/:id', protect, getAssetById);
router.post('/', protect, assetValidation, validate, createAsset);
router.put('/:id', protect, assetValidation, validate, updateAsset);
router.delete('/:id', protect, deleteAsset);

module.exports = router;
