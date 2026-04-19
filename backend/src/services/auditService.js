const db = require('../config/db');

class AuditService {
  async logAction({ userId, action, entityType, entityId, details }) {
    const { error } = await db.from('audit_logs').insert({
      user_id: userId || null,
      action,
      entity_type: entityType || null,
      entity_id: entityId || null,
      details: details || null,
    });
    if (error) console.error('Audit log error:', error.message);
  }

  async findAll({ entityType, entityId } = {}) {
    let query = db.from('audit_logs').select('*, users(email, full_name)').order('created_at', { ascending: false });
    if (entityType) query = query.eq('entity_type', entityType);
    if (entityId)   query = query.eq('entity_id', entityId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }
}

module.exports = new AuditService();
