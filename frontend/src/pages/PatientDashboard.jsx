import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [unread, setUnread] = useState([]);

  useEffect(() => {
    api.get('/reports').then(r => setReports(r.data.data || [])).catch(() => {});
    api.get('/prescriptions').then(r => setPrescriptions(r.data.data || [])).catch(() => {});
    api.get('/notifications/unread').then(r => setUnread(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {user?.full_name}</h1>
      <p className="text-gray-500 text-sm mb-8">Patient Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Reports" value={reports.length} color="blue" />
        <StatCard label="Prescriptions" value={prescriptions.length} color="green" />
        <StatCard label="Unread Notifications" value={unread.length} color="yellow" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Recent Reports" link="/reports" linkLabel="View all">
          {reports.slice(0, 3).map(r => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-gray-700 truncate">{r.file_url?.split('/').pop() || 'Report'}</span>
              <StatusBadge status={r.status} />
            </div>
          ))}
          {reports.length === 0 && <p className="text-sm text-gray-400">No reports yet.</p>}
        </Section>

        <Section title="Recent Prescriptions" link="/prescriptions" linkLabel="View all">
          {prescriptions.slice(0, 3).map(p => (
            <div key={p.id} className="py-2 border-b last:border-0">
              <p className="text-sm font-medium text-gray-700 truncate">{p.diagnosis}</p>
              <p className="text-xs text-gray-400">{new Date(p.prescribed_at).toLocaleDateString()}</p>
            </div>
          ))}
          {prescriptions.length === 0 && <p className="text-sm text-gray-400">No prescriptions yet.</p>}
        </Section>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', yellow: 'bg-yellow-50 text-yellow-700' };
  return (
    <div className={`rounded-xl p-6 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 font-medium">{label}</p>
    </div>
  );
}

function Section({ title, link, linkLabel, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <Link to={link} className="text-xs text-blue-600 hover:underline">{linkLabel}</Link>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { PROCESSING: 'bg-yellow-100 text-yellow-700', COMPLETED: 'bg-green-100 text-green-700', FAILED: 'bg-red-100 text-red-700' };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || ''}`}>{status}</span>;
}
