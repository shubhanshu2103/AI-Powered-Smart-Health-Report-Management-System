import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const toggleStatus = async (id, is_active) => {
    await api.put(`/admin/users/${id}/status`, { is_active: !is_active }).catch(() => {});
    setUsers(users.map(u => u.id === id ? { ...u, is_active: !is_active } : u));
  };

  const verifyDoctor = async (id) => {
    await api.put(`/admin/users/${id}/verify-doctor`).catch(() => {});
    setUsers(users.map(u => u.id === id ? { ...u, is_verified: true } : u));
  };

  const roleColor = { ADMIN: 'bg-purple-100 text-purple-700', DOCTOR: 'bg-green-100 text-green-700', PATIENT: 'bg-blue-100 text-blue-700' };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{u.full_name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role] || ''}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.is_verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => toggleStatus(u.id, u.is_active)}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  {u.role === 'DOCTOR' && !u.is_verified && (
                    <button onClick={() => verifyDoctor(u.id)}
                      className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition">
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No users found.</p>}
      </div>
    </div>
  );
}
