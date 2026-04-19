const db = require('../config/db');

function check({ data, error }, single = false) {
  if (error && error.code !== 'PGRST116') throw error;
  return single ? (data ?? null) : (data ?? []);
}

class NotificationRepository {
  async save({ user_id, type, title, message }) {
    const res = await db.from('notifications').insert({ user_id, type, title, message }).select().single();
    return check(res, true);
  }

  async findUnread(userId) {
    const res = await db.from('notifications')
      .select('*').eq('user_id', userId).eq('is_read', false)
      .order('created_at', { ascending: false });
    return check(res);
  }

  async findAll(userId) {
    const res = await db.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return check(res);
  }

  async markAsRead(id, userId) {
    const res = await db.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', userId).select().single();
    return check(res, true);
  }

  async markAllRead(userId) {
    const { error } = await db.from('notifications').update({ is_read: true }).eq('user_id', userId);
    if (error) throw error;
  }
}

module.exports = new NotificationRepository();
