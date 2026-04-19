const reportRepo = require('../repositories/reportRepository');
const userRepo = require('../repositories/userRepository');
const aiService = require('./aiService');
const notificationService = require('./notificationService');
const auditService = require('./auditService');

class ReportService {
  async uploadReport({ userId, filePath, fileName }) {
    const patientProfile = await userRepo.findPatientProfile(userId);
    if (!patientProfile) throw Object.assign(new Error('Patient profile not found.'), { status: 404 });

    const report = await reportRepo.save({
      patient_id: patientProfile.id,
      uploaded_by: userId,
      file_url: filePath || null,
      status: 'PROCESSING',
    });

    this._processAsync(report.id, patientProfile, userId, filePath, fileName);

    return report;
  }

  async _processAsync(reportId, patientProfile, userId, filePath, fileName) {
    try {
      const extractedText = filePath ? await aiService.extractText(filePath) : (fileName || '');
      const aiSummary = await aiService.generateSummary(extractedText || fileName || 'Medical report uploaded.', filePath);

      await reportRepo.updateStatus(reportId, 'COMPLETED', extractedText, aiSummary);

      await notificationService.sendNotification({
        userId,
        type: 'REPORT_READY',
        title: 'Your report is ready',
        message: `Your medical report "${fileName || 'Uploaded Report'}" has been processed.`,
      });

      await auditService.logAction({
        userId,
        action: 'REPORT_PROCESSED',
        entityType: 'REPORT',
        entityId: reportId,
        details: { status: 'COMPLETED' },
      });
    } catch (err) {
      await reportRepo.updateStatus(reportId, 'FAILED', null, null);
      await auditService.logAction({
        userId,
        action: 'REPORT_PROCESSING_FAILED',
        entityType: 'REPORT',
        entityId: reportId,
        details: { error: err.message },
      });
    }
  }

  async getReport(reportId, user) {
    const report = await reportRepo.findById(reportId);
    if (!report) throw Object.assign(new Error('Report not found.'), { status: 404 });

    if (user.role === 'PATIENT') {
      const patientProfile = await userRepo.findPatientProfile(user.id);
      if (!patientProfile || patientProfile.id !== report.patient_id) {
        throw Object.assign(new Error('Access denied.'), { status: 403 });
      }
    }
    return report;
  }

  async getMyReports(userId) {
    const patientProfile = await userRepo.findPatientProfile(userId);
    if (!patientProfile) return [];
    return reportRepo.findByPatient(patientProfile.id);
  }

  async getPatientReports(patientProfileId) {
    return reportRepo.findByPatient(patientProfileId);
  }

  async getAllReports() {
    return reportRepo.findAll();
  }

  async getAllPatientsReports() {
    return reportRepo.findAllWithPatientInfo();
  }
}

module.exports = new ReportService();
