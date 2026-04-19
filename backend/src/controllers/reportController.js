const reportService = require('../services/reportService');
const { success, error } = require('../utils/response');

exports.upload = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;
    const fileName = req.file ? req.file.originalname : req.body.title || 'Uploaded Report';
    const report = await reportService.uploadReport({ userId: req.user.id, filePath, fileName });
    return success(res, report, 'Report upload initiated. Processing in background.', 202);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await reportService.getMyReports(req.user.id);
    return success(res, reports);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await reportService.getReport(req.params.id, req.user);
    return success(res, report);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const reports = await reportService.getPatientReports(req.params.patientProfileId);
    return success(res, reports);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
    return success(res, reports);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getAllPatientsReports = async (req, res) => {
  try {
    const reports = await reportService.getAllPatientsReports();
    return success(res, reports);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
