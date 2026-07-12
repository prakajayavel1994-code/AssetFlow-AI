const mongoose = require('mongoose');
const generateCode = require('../utils/codeGenerator');

const maintenanceSchema = new mongoose.Schema({
  maintenanceCode: { type: String, unique: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  maintenanceType: { type: String, required: true },
  description: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },
  vendor: { type: String },
  cost: { type: Number, default: 0 },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['upcoming', 'completed', 'overdue'], default: 'upcoming' }
}, { timestamps: true });

maintenanceSchema.pre('validate', async function (next) {
  if (!this.maintenanceCode) {
    this.maintenanceCode = await generateCode(mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema), 'MNT');
  }
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
