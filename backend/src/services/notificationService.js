const notificationRepo = require('../repositories/notificationRepository');

class NotificationService {
  async sendNotification({ userId, type, title, message }) {
    return notificationRepo.save({ user_id: userId, type, title, message });
  }

  async getNotifications(userId) {
    return notificationRepo.findAll(userId);
  }

  async getUnread(userId) {
    return notificationRepo.findUnread(userId);
  }

  async markAsRead(id, userId) {
    return notificationRepo.markAsRead(id, userId);
  }

  async markAllRead(userId) {
    return notificationRepo.markAllRead(userId);
  }
}

module.exports = new NotificationService();
