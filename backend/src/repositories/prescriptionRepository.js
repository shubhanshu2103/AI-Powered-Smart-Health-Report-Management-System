const db = require('../config/db');

function check({ data, error }, single = false) {
  if (error && error.code !== 'PGRST116') throw error;
  return single ? (data ?? null) : (data ?? []);
}

class PrescriptionRepository {
  async save({ patient_id, doctor_id, diagnosis }) {
    const res = await db.from('prescriptions').insert({ patient_id, doctor_id, diagnosis }).select().single();
    return check(res, true);
  }

  async findById(id) {
    const res = await db.from('prescriptions').select('*').eq('id', id).single();
    return check(res, true);
  }

  async findByPatient(patientProfileId) {
    const res = await db.from('prescriptions')
      .select('*, medications(*)')
      .eq('patient_id', patientProfileId)
      .order('prescribed_at', { ascending: false });
    return check(res);
  }

  async findByDoctor(doctorProfileId) {
    const res = await db.from('prescriptions')
      .select('*, medications(*)')
      .eq('doctor_id', doctorProfileId)
      .order('prescribed_at', { ascending: false });
    return check(res);
  }

  async addMedication({ prescription_id, medicine_name, dosage, frequency, duration_days }) {
    const res = await db.from('medications')
      .insert({ prescription_id, medicine_name, dosage, frequency, duration_days })
      .select().single();
    return check(res, true);
  }

  async findMedications(prescriptionId) {
    const res = await db.from('medications').select('*').eq('prescription_id', prescriptionId);
    return check(res);
  }
}

module.exports = new PrescriptionRepository();
