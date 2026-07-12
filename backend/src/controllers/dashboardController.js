const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Maintenance = require('../models/Maintenance');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/apiResponse');

const getDashboard = async (req, res, next) => {
  try {
    if (req.user?.role === 'employee') {
      const assignments = await Assignment.find({ employee: req.user._id, status: 'active' }).populate('asset');
      const assetIds = assignments.map((entry) => entry.asset?._id).filter(Boolean);
      const maintenanceRequests = await Maintenance.find({ asset: { $in: assetIds } }).populate('asset');
      const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);

      return sendResponse(res, 200, true, 'Dashboard data fetched', {
        totalAssets: assignments.length,
        assignedAssets: assignments.length,
        maintenanceDue: maintenanceRequests.length,
        recentActivities: [
          { type: 'asset', message: 'Your assigned assets are visible here' },
          { type: 'maintenance', message: 'Maintenance requests can be raised quickly' },
          { type: 'notification', message: 'Updates and alerts are shared in the notifications center' }
        ],
        myAssets: assignments.map((entry) => entry.asset),
        maintenanceRequests,
        notifications,
      });
    }

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
