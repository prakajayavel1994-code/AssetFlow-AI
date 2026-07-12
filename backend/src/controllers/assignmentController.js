const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const { sendResponse } = require('../utils/apiResponse');
const { body } = require('express-validator');

const assignAsset = async (req, res, next) => {
  try {
    const { assetId, employeeId, remarks } = req.body;
    const asset = await Asset.findById(assetId);
    const employee = await Employee.findById(employeeId);
    if (!asset || !employee) return sendResponse(res, 404, false, 'Asset or employee not found', {});

    const assignment = await Assignment.create({ asset: assetId, employee: employeeId, remarks, status: 'active' });
    asset.status = 'assigned';
    await asset.save();

    return sendResponse(res, 201, true, 'Asset assigned successfully', { assignment });
  } catch (error) {
    next(error);
  }
};

const returnAsset = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return sendResponse(res, 404, false, 'Assignment not found', {});

    assignment.status = 'returned';
    assignment.returnDate = new Date();
    await assignment.save();

    const asset = await Asset.findById(assignment.asset);
    if (asset) {
      asset.status = 'available';
      await asset.save();
    }

    return sendResponse(res, 200, true, 'Asset returned successfully', { assignment });
  } catch (error) {
    next(error);
  }
};

const getAssignmentHistory = async (req, res, next) => {
  try {
    const assignments = await Assignment.find().populate('asset employee').sort({ assignedDate: -1 });
    return sendResponse(res, 200, true, 'Assignment history fetched', { assignments });
  } catch (error) {
    next(error);
  }
};

const assignmentValidation = [
  body('assetId').notEmpty().withMessage('Asset ID is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required')
];

module.exports = { assignAsset, returnAsset, getAssignmentHistory, assignmentValidation };
