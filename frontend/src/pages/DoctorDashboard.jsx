import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/reports/patients/all').then(r => setReports(r.data.data || [])),
      api.get('/prescriptions').then(r => setPrescriptions(r.data.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleWritePrescription = (report) => {
    const profileId = report.patient_profiles?.id;
    const patientName = report.patient_profiles?.users?.full_name || 'Patient';
    navigate(`/prescriptions?patient_profile_id=${profileId}&patient_name=${encodeURIComponent(patientName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, Dr. {user?.full_name}</h1>
      <p className="text-gray-500 text-sm mb-8">Doctor Dashboard</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Patient Reports" value={reports.length} color="blue" />
        <StatCard label="Prescriptions Issued" value={prescriptions.length} color="green" />
        <StatCard
          label="Completed Reports"
          value={reports.filter(r => r.status === 'COMPLETED').length}
          color="indigo"
        />
      </div>

      {/* Patient Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Patient Reports</h2>
          <span className="text-xs text-gray-400">{reports.length} total</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No patient reports yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Patient Profile ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">AI Summary</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map(r => {
                  const profileId = r.patient_profiles?.id;
                  const name = r.patient_profiles?.users?.full_name || '—';
                  const email = r.patient_profiles?.users?.email || '—';
                  const isExpanded = expanded === r.id;

                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-medium text-gray-800">{name}</td>
                      <td className="px-5 py-4 text-gray-500">{email}</td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 select-all">
                          {profileId}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        {r.ai_summary ? (
                          <div>
                            <p className={`text-gray-600 text-xs ${isExpanded ? '' : 'line-clamp-2'}`}>
                              {r.ai_summary}
                            </p>
                            <button
                              onClick={() => setExpanded(isExpanded ? null : r.id)}
                              className="text-blue-500 text-xs mt-1 hover:underline"
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">
                            {r.status === 'PROCESSING' ? 'Processing…' : '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleWritePrescription(r)}
                          disabled={!profileId}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                        >
                          Write Rx
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent prescriptions issued by this doctor */}
      {prescriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">My Recent Prescriptions</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide text-left">
              <tr>
                <th className="px-5 py-3">Diagnosis</th>
                <th className="px-5 py-3">Medications</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prescriptions.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{p.diagnosis}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {Array.isArray(p.medications)
                      ? p.medications.filter(Boolean).map(m => m.medicine_name).join(', ') || '—'
                      : '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(p.prescribed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <div className={`rounded-xl p-6 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 font-medium">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PROCESSING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
