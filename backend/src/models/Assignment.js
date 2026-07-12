const mongoose = require('mongoose');
const generateCode = require('../utils/codeGenerator');

const assignmentSchema = new mongoose.Schema({
  assignmentCode: { type: String, unique: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  assignedDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ['active', 'returned'], default: 'active' },
  remarks: { type: String }
}, { timestamps: true });

assignmentSchema.pre('validate', async function (next) {
  if (!this.assignmentCode) {
    this.assignmentCode = await generateCode(mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema), 'ASN');
  }
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
