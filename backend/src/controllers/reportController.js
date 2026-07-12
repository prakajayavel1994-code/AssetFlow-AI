const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Maintenance = require('../models/Maintenance');
const { sendResponse } = require('../utils/apiResponse');

const getReportSummary = async (req, res, next) => {
  try {
    const assets = await Asset.find();
    const employees = await Employee.find();
    const maintenance = await Maintenance.find().populate('asset');
    return sendResponse(res, 200, true, 'Reports fetched', {
      assets,
      employees,
      maintenance
    });
  } catch (error) {
    next(error);
  }
};

const getAssetReport = async (req, res, next) => {
  try {
    const assets = await Asset.find();
    return sendResponse(res, 200, true, 'Asset report fetched', { assets });
  } catch (error) {
    next(error);
  }
};

const getMaintenanceReport = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find().populate('asset');
    return sendResponse(res, 200, true, 'Maintenance report fetched', { maintenance });
  } catch (error) {
    next(error);
  }
};

const getEmployeeReport = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    return sendResponse(res, 200, true, 'Employee report fetched', { employees });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReportSummary, getAssetReport, getMaintenanceReport, getEmployeeReport };
