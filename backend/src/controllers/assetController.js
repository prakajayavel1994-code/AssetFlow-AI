const Asset = require('../models/Asset');
const { sendResponse } = require('../utils/apiResponse');
const { body } = require('express-validator');
const { generateQRCodeDataURL, generateQRCodeBuffer } = require('../services/qrService');

const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Assets fetched', { assets });
  } catch (error) {
    next(error);
  }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return sendResponse(res, 404, false, 'Asset not found', {});
    return sendResponse(res, 200, true, 'Asset fetched', { asset });
  } catch (error) {
    next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    const qrCode = await generateQRCodeDataURL(req.body.assetName || 'AssetFlow');
    const asset = await Asset.create({ ...req.body, qrCode });
    return sendResponse(res, 201, true, 'Asset created', { asset });
  } catch (error) {
    next(error);
  }
};

const getAssetQr = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return sendResponse(res, 404, false, 'Asset not found', {});

    const qrBuffer = await generateQRCodeBuffer(asset.assetCode || asset.assetName || asset._id.toString());
    res.set('Content-Type', 'image/png');
    return res.send(qrBuffer);
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) return sendResponse(res, 404, false, 'Asset not found', {});
    return sendResponse(res, 200, true, 'Asset updated', { asset });
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return sendResponse(res, 404, false, 'Asset not found', {});
    return sendResponse(res, 200, true, 'Asset deleted', {});
  } catch (error) {
    next(error);
  }
};

const assetValidation = [
  body('assetName').notEmpty().withMessage('Asset name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['available', 'assigned', 'maintenance', 'retired'])
];

module.exports = { getAssets, getAssetById, createAsset, getAssetQr, updateAsset, deleteAsset, assetValidation };
