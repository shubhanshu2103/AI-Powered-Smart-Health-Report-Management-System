import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then(r => setNotifications(r.data.data || [])).catch(() => {});
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const typeColor = { REPORT_READY: 'bg-green-100 text-green-700', MEDICATION_REMINDER: 'bg-blue-100 text-blue-700', SYSTEM_ALERT: 'bg-yellow-100 text-yellow-700' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Mark all read</button>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
            className={`rounded-xl border p-4 cursor-pointer transition ${n.is_read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[n.type] || 'bg-gray-100 text-gray-600'}`}>{n.type.replace(/_/g, ' ')}</span>
              <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
            </div>
            <p className="font-medium text-sm text-gray-800">{n.title}</p>
            {n.message && <p className="text-sm text-gray-600 mt-1">{n.message}</p>}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
