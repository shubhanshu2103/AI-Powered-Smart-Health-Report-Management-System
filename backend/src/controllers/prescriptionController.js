const prescriptionService = require('../services/prescriptionService');
const { success, error } = require('../utils/response');

exports.create = async (req, res) => {
  try {
    const { patient_profile_id, diagnosis, medications } = req.body;
    if (!patient_profile_id || !diagnosis) return error(res, 'patient_profile_id and diagnosis are required.', 400);
    const prescription = await prescriptionService.createPrescription({
      doctorUserId: req.user.id,
      patientProfileId: patient_profile_id,
      diagnosis,
      medications: medications || [],
    });
    return success(res, prescription, 'Prescription created.', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.addMedication = async (req, res) => {
  try {
    const { medicine_name, dosage, frequency, duration_days } = req.body;
    if (!medicine_name) return error(res, 'medicine_name is required.', 400);
    const med = await prescriptionService.addMedication(
      req.params.id,
      { medicine_name, dosage, frequency, duration_days },
      req.user.id
    );
    return success(res, med, 'Medication added.', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    const data = await prescriptionService.getMyPrescriptions(req.user.id, req.user.role);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const data = await prescriptionService.getPrescription(req.params.id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};
