const success = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

const error = (res, message = 'Internal server error', status = 500, details = null) =>
  res.status(status).json({ success: false, message, ...(details && { details }) });

module.exports = { success, error };
