const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');
const auditService = require('./auditService');

class UserService {
  async registerUser({ email, password, full_name, role = 'PATIENT', profileData = {} }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already registered.'), { status: 409 });

    const password_hash = await bcrypt.hash(password, 12);
    const user = await userRepo.save({ email, password_hash, full_name, role });

    if (role === 'DOCTOR') {
      await userRepo.saveDoctorProfile({
        user_id: user.id,
        specialization: profileData.specialization || null,
        license_number: profileData.license_number || null,
        bio: profileData.bio || null,
      });
    } else if (role === 'PATIENT') {
      await userRepo.savePatientProfile({
        user_id: user.id,
        date_of_birth: profileData.date_of_birth || null,
        gender: profileData.gender || null,
        medical_history: profileData.medical_history || null,
      });
    }

    await auditService.logAction({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: user.id,
      details: { email, role },
    });

    const token = this._signToken(user);
    const { password_hash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async loginUser({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials.'), { status: 401 });
    if (!user.is_active) throw Object.assign(new Error('Account is deactivated.'), { status: 403 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw Object.assign(new Error('Invalid credentials.'), { status: 401 });

    await auditService.logAction({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
    });

    const token = this._signToken(user);
    const { password_hash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    const { password_hash: _, ...safeUser } = user;

    let profile = null;
    if (user.role === 'DOCTOR') profile = await userRepo.findDoctorProfile(userId);
    if (user.role === 'PATIENT') profile = await userRepo.findPatientProfile(userId);

    return { ...safeUser, profile };
  }

  async updateProfile(userId, role, fields) {
    if (role === 'PATIENT') return userRepo.updatePatientProfile(userId, fields);
    if (role === 'DOCTOR') return userRepo.updateDoctorProfile(userId, fields);
  }

  async getAllUsers() {
    return userRepo.findAll();
  }

  async setUserStatus(targetId, is_active) {
    return userRepo.update(targetId, { is_active });
  }

  async verifyDoctor(userId) {
    return userRepo.update(userId, { is_verified: true });
  }

  _signToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = new UserService();
