const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/apiResponse');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Notifications fetched', { notifications });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return sendResponse(res, 404, false, 'Notification not found', {});
    return sendResponse(res, 200, true, 'Notification marked as read', { notification });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead };
