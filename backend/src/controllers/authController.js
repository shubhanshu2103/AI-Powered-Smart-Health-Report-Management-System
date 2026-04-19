const userService = require('../services/userService');
const { success, error } = require('../utils/response');

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, role, ...profileData } = req.body;
    if (!email || !password || !full_name) return error(res, 'email, password, full_name are required.', 400);
    const result = await userService.registerUser({ email, password, full_name, role, profileData });
    return success(res, result, 'Registration successful.', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'email and password are required.', 400);
    const result = await userService.loginUser({ email, password });
    return success(res, result, 'Login successful.');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    return success(res, profile);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await userService.updateProfile(req.user.id, req.user.role, req.body);
    return success(res, updated, 'Profile updated.');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
