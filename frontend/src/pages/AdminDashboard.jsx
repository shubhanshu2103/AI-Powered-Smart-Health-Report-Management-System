import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const counts = { PATIENT: 0, DOCTOR: 0, ADMIN: 0 };
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">System overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 text-blue-700 rounded-xl p-6">
          <p className="text-3xl font-bold">{counts.PATIENT}</p>
          <p className="text-sm mt-1 font-medium">Patients</p>
        </div>
        <div className="bg-green-50 text-green-700 rounded-xl p-6">
          <p className="text-3xl font-bold">{counts.DOCTOR}</p>
          <p className="text-sm mt-1 font-medium">Doctors</p>
        </div>
        <div className="bg-purple-50 text-purple-700 rounded-xl p-6">
          <p className="text-3xl font-bold">{users.length}</p>
          <p className="text-sm mt-1 font-medium">Total Users</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/admin/users" className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
          Manage Users
        </Link>
        <Link to="/admin/audit" className="bg-gray-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
          View Audit Logs
        </Link>
      </div>
    </div>
  );
}
