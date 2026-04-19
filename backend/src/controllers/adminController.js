const userService = require('../services/userService');
const auditService = require('../services/auditService');
const { success, error } = require('../utils/response');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return success(res, users);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.setUserStatus = async (req, res) => {
  try {
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') return error(res, 'is_active (boolean) is required.', 400);
    const user = await userService.setUserStatus(req.params.id, is_active);
    return success(res, user, `User ${is_active ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.verifyDoctor = async (req, res) => {
  try {
    const user = await userService.verifyDoctor(req.params.id);
    return success(res, user, 'Doctor verified.');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { entity_type, entity_id } = req.query;
    const logs = await auditService.findAll({ entityType: entity_type, entityId: entity_id });
    return success(res, logs);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
