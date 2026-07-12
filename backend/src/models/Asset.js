const mongoose = require('mongoose');
const generateCode = require('../utils/codeGenerator');

const assetSchema = new mongoose.Schema({
  assetCode: { type: String, unique: true },
  assetName: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number, default: 0 },
  vendor: { type: String },
  warrantyExpiry: { type: Date },
  status: { type: String, enum: ['available', 'assigned', 'maintenance', 'retired'], default: 'available' },
  location: { type: String },
  imageUrl: { type: String },
  qrCode: { type: String },
  remarks: { type: String }
}, { timestamps: true });

assetSchema.pre('validate', async function (next) {
  if (!this.assetCode) {
    this.assetCode = await generateCode(mongoose.models.Asset || mongoose.model('Asset', assetSchema), 'AST');
  }
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
