const db = require('../config/db');

function check({ data, error }, single = false) {
  if (error && error.code !== 'PGRST116') throw error;
  return single ? (data ?? null) : (data ?? []);
}

class ReportRepository {
  async save({ patient_id, uploaded_by, file_url, extracted_text, ai_summary, status }) {
    const res = await db.from('reports')
      .insert({ patient_id, uploaded_by, file_url, extracted_text, ai_summary, status: status || 'PROCESSING' })
      .select().single();
    return check(res, true);
  }

  async findById(id) {
    const res = await db.from('reports').select('*').eq('id', id).single();
    return check(res, true);
  }

  async findByPatient(patientProfileId) {
    const res = await db.from('reports').select('*').eq('patient_id', patientProfileId).order('created_at', { ascending: false });
    return check(res);
  }

  async updateStatus(id, status, extracted_text, ai_summary) {
    const res = await db.from('reports')
      .update({ status, extracted_text, ai_summary, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    return check(res, true);
  }

  async findAll() {
    const res = await db.from('reports').select('*').order('created_at', { ascending: false });
    return check(res);
  }

  async findAllWithPatientInfo() {
    const res = await db.from('reports')
      .select(`
        id, status, ai_summary, file_url, created_at, updated_at,
        patient_profiles (
          id,
          date_of_birth,
          gender,
          users (
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });
    return check(res);
  }
}

module.exports = new ReportRepository();
