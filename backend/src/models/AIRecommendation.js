const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, default: 0 },
  recommendation: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
