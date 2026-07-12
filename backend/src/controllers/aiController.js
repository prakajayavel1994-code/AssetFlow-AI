const { predictMaintenance, chatAssistant } = require('../services/aiService');
const AIRecommendation = require('../models/AIRecommendation');
const Asset = require('../models/Asset');
const { sendResponse } = require('../utils/apiResponse');

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await AIRecommendation.find().populate('asset').sort({ generatedAt: -1 });
    return sendResponse(res, 200, true, 'AI recommendations fetched', { recommendations });
  } catch (error) {
    next(error);
  }
};

const generateRecommendation = async (req, res, next) => {
  try {
    const { assetId, assetName } = req.body;
    if (!assetId) {
      return sendResponse(res, 400, false, 'assetId is required', {});
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return sendResponse(res, 404, false, 'Asset not found', {});
    }

    const result = await predictMaintenance({ assetName: asset.assetName || assetName || 'Asset' });
    const recommendation = await AIRecommendation.create({
      asset: assetId,
      prediction: result.prediction,
      confidence: result.confidence,
      recommendation: result.recommendation
    });
    return sendResponse(res, 201, true, 'AI recommendation generated', { recommendation });
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const response = await chatAssistant(req.body.message || 'Hello');
    return sendResponse(res, 200, true, 'AI assistant response', { response });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, generateRecommendation, chat };
