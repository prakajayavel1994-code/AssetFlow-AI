const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Maintenance = require('../models/Maintenance');
const Assignment = require('../models/Assignment');
const { sendResponse } = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const assignedAssets = await Assignment.countDocuments({ status: 'active' });
    const employees = await Employee.countDocuments();
    const maintenanceDue = await Maintenance.countDocuments({ status: 'upcoming' });
    const warrantyExpiring = await Asset.countDocuments({ warrantyExpiry: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    const recentActivities = [
      { type: 'asset', message: 'New assets added to the inventory' },
      { type: 'assignment', message: 'Recent asset assignments updated' },
      { type: 'maintenance', message: 'Maintenance schedule reviewed' }
    ];

    return sendResponse(res, 200, true, 'Dashboard data fetched', {
      totalAssets,
      totalEmployees: employees,
      assignedAssets,
      maintenanceDue,
      warrantyExpiring,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
