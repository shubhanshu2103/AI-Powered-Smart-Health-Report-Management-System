const prescriptionRepo = require('../repositories/prescriptionRepository');
const userRepo = require('../repositories/userRepository');
const auditService = require('./auditService');
const notificationService = require('./notificationService');

class PrescriptionService {
  async createPrescription({ doctorUserId, patientProfileId, diagnosis, medications = [] }) {
    const doctorProfile = await userRepo.findDoctorProfile(doctorUserId);
    if (!doctorProfile) throw Object.assign(new Error('Doctor profile not found.'), { status: 404 });

    const patientProfile = await userRepo.findPatientProfileById(patientProfileId);
    if (!patientProfile) throw Object.assign(new Error('Patient profile not found.'), { status: 404 });

    const prescription = await prescriptionRepo.save({
      patient_id: patientProfileId,
      doctor_id: doctorProfile.id,
      diagnosis,
    });

    const savedMeds = [];
    for (const med of medications) {
      const savedMed = await prescriptionRepo.addMedication({
        prescription_id: prescription.id,
        medicine_name: med.medicine_name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration_days: med.duration_days,
      });
      savedMeds.push(savedMed);
    }

    await notificationService.sendNotification({
      userId: patientProfile.user_id,
      type: 'SYSTEM_ALERT',
      title: 'New prescription issued',
      message: `A new prescription has been created for: ${diagnosis}`,
    });

    await auditService.logAction({
      userId: doctorUserId,
      action: 'PRESCRIPTION_CREATED',
      entityType: 'PRESCRIPTION',
      entityId: prescription.id,
      details: { diagnosis, medicationCount: savedMeds.length },
    });

    return { ...prescription, medications: savedMeds };
  }

  async addMedication(prescriptionId, medData, doctorUserId) {
    const prescription = await prescriptionRepo.findById(prescriptionId);
    if (!prescription) throw Object.assign(new Error('Prescription not found.'), { status: 404 });

    const doctorProfile = await userRepo.findDoctorProfile(doctorUserId);
    if (!doctorProfile || doctorProfile.id !== prescription.doctor_id) {
      throw Object.assign(new Error('Access denied.'), { status: 403 });
    }

    const med = await prescriptionRepo.addMedication({ prescription_id: prescriptionId, ...medData });

    await auditService.logAction({
      userId: doctorUserId,
      action: 'MEDICATION_ADDED',
      entityType: 'MEDICATION',
      entityId: med.id,
      details: { prescriptionId, medicine_name: medData.medicine_name },
    });

    return med;
  }

  async getMyPrescriptions(userId, role) {
    if (role === 'PATIENT') {
      const profile = await userRepo.findPatientProfile(userId);
      if (!profile) return [];
      return prescriptionRepo.findByPatient(profile.id);
    }
    if (role === 'DOCTOR') {
      const profile = await userRepo.findDoctorProfile(userId);
      if (!profile) return [];
      return prescriptionRepo.findByDoctor(profile.id);
    }
    return [];
  }

  async getPrescription(id) {
    const prescription = await prescriptionRepo.findById(id);
    if (!prescription) throw Object.assign(new Error('Prescription not found.'), { status: 404 });
    const medications = await prescriptionRepo.findMedications(id);
    return { ...prescription, medications };
  }
}

module.exports = new PrescriptionService();
