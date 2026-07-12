const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');
const { sendResponse } = require('../utils/apiResponse');
const { body } = require('express-validator');

const getMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find().populate('asset').sort({ scheduledDate: 1 });
    return sendResponse(res, 200, true, 'Maintenance records fetched', { maintenance });
  } catch (error) {
    next(error);
  }
};

const createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.create(req.body);
    return sendResponse(res, 201, true, 'Maintenance record created', { maintenance });
  } catch (error) {
    next(error);
  }
};

const updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!maintenance) return sendResponse(res, 404, false, 'Maintenance record not found', {});
    return sendResponse(res, 200, true, 'Maintenance record updated', { maintenance });
  } catch (error) {
    next(error);
  }
};

const deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return sendResponse(res, 404, false, 'Maintenance record not found', {});
    return sendResponse(res, 200, true, 'Maintenance record deleted', {});
  } catch (error) {
    next(error);
  }
};

const getUpcomingMaintenance = async (req, res, next) => {
  try {
    const upcoming = await Maintenance.find({ status: 'upcoming' }).populate('asset').sort({ scheduledDate: 1 });
    return sendResponse(res, 200, true, 'Upcoming maintenance fetched', { maintenance: upcoming });
  } catch (error) {
    next(error);
  }
};

const getCompletedMaintenance = async (req, res, next) => {
  try {
    const completed = await Maintenance.find({ status: 'completed' }).populate('asset').sort({ completedDate: -1 });
    return sendResponse(res, 200, true, 'Completed maintenance fetched', { maintenance: completed });
  } catch (error) {
    next(error);
  }
};

const maintenanceValidation = [
  body('asset').notEmpty().withMessage('Asset is required'),
  body('maintenanceType').notEmpty().withMessage('Maintenance type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('scheduledDate').notEmpty().withMessage('Scheduled date is required')
];

module.exports = { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance, getUpcomingMaintenance, getCompletedMaintenance, maintenanceValidation };
