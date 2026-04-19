const notificationService = require('../services/notificationService');
const { success, error } = require('../utils/response');

exports.getAll = async (req, res) => {
  try {
    const data = await notificationService.getNotifications(req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getUnread = async (req, res) => {
  try {
    const data = await notificationService.getUnread(req.user.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.markRead = async (req, res) => {
  try {
    const data = await notificationService.markAsRead(req.params.id, req.user.id);
    return success(res, data, 'Marked as read.');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead(req.user.id);
    return success(res, null, 'All notifications marked as read.');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
