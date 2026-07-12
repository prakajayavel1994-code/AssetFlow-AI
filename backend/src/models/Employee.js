const mongoose = require('mongoose');
const generateCode = require('../utils/codeGenerator');

const employeeSchema = new mongoose.Schema({
  employeeCode: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

employeeSchema.pre('validate', async function (next) {
  if (!this.employeeCode) {
    this.employeeCode = await generateCode(mongoose.models.Employee || mongoose.model('Employee', employeeSchema), 'EMP');
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
