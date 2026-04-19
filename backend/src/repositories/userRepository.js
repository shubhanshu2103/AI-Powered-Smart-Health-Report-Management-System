const db = require('../config/db');

function check({ data, error }, single = false) {
  if (error && error.code !== 'PGRST116') throw error;
  return single ? (data ?? null) : (data ?? []);
}

class UserRepository {
  async findByEmail(email) {
    const res = await db.from('users').select('*').eq('email', email).single();
    return check(res, true);
  }

  async findById(id) {
    const res = await db.from('users').select('*').eq('id', id).single();
    return check(res, true);
  }

  async save({ email, password_hash, full_name, role }) {
    const res = await db.from('users').insert({ email, password_hash, full_name, role }).select().single();
    return check(res, true);
  }

  async update(id, fields) {
    const res = await db.from('users').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    return check(res, true);
  }

  async findAll() {
    const res = await db.from('users').select('id, email, full_name, role, is_active, is_verified, created_at').order('created_at', { ascending: false });
    return check(res);
  }

  async findDoctorProfile(userId) {
    const res = await db.from('doctor_profiles').select('*').eq('user_id', userId).single();
    return check(res, true);
  }

  async saveDoctorProfile({ user_id, specialization, license_number, bio }) {
    const res = await db.from('doctor_profiles').insert({ user_id, specialization, license_number, bio }).select().single();
    return check(res, true);
  }

  async findPatientProfile(userId) {
    const res = await db.from('patient_profiles').select('*').eq('user_id', userId).single();
    return check(res, true);
  }

  async savePatientProfile({ user_id, date_of_birth, gender, medical_history }) {
    const res = await db.from('patient_profiles').insert({ user_id, date_of_birth, gender, medical_history }).select().single();
    return check(res, true);
  }

  async updatePatientProfile(userId, fields) {
    const res = await db.from('patient_profiles').update(fields).eq('user_id', userId).select().single();
    return check(res, true);
  }

  async updateDoctorProfile(userId, fields) {
    const res = await db.from('doctor_profiles').update(fields).eq('user_id', userId).select().single();
    return check(res, true);
  }

  async findDoctorProfileById(id) {
    const res = await db.from('doctor_profiles').select('*').eq('id', id).single();
    return check(res, true);
  }

  async findPatientProfileById(id) {
    const res = await db.from('patient_profiles').select('*').eq('id', id).single();
    return check(res, true);
  }
}

module.exports = new UserRepository();
