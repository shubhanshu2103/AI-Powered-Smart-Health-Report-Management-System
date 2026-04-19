import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/audit-logs').then(r => setLogs(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Audit Logs</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{l.action}</td>
                <td className="px-4 py-3 text-gray-500">{l.entity_type || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{l.email || l.user_id?.slice(0, 8) || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">
                  {l.details ? JSON.stringify(l.details) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No audit logs.</p>}
      </div>
    </div>
  );
}
