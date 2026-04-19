import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Prescriptions() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const prefillProfileId = searchParams.get('patient_profile_id') || '';
  const prefillName = searchParams.get('patient_name') || '';

  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(!!prefillProfileId);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    patient_profile_id: prefillProfileId,
    patient_name: prefillName,
    diagnosis: '',
    medications: [{ medicine_name: '', dosage: '', frequency: '', duration_days: '' }],
  });

  useEffect(() => {
    api.get('/prescriptions').then(r => setPrescriptions(r.data.data || [])).catch(() => {});
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMed = (i, e) => {
    const meds = [...form.medications];
    meds[i] = { ...meds[i], [e.target.name]: e.target.value };
    setForm({ ...form, medications: meds });
  };

  const addMed = () =>
    setForm({ ...form, medications: [...form.medications, { medicine_name: '', dosage: '', frequency: '', duration_days: '' }] });

  const removeMed = (i) =>
    setForm({ ...form, medications: form.medications.filter((_, idx) => idx !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/prescriptions', {
        patient_profile_id: form.patient_profile_id,
        diagnosis: form.diagnosis,
        medications: form.medications.filter(m => m.medicine_name.trim()),
      });
      setPrescriptions([data.data, ...prescriptions]);
      setShowForm(false);
      setForm({
        patient_profile_id: '',
        patient_name: '',
        diagnosis: '',
        medications: [{ medicine_name: '', dosage: '', frequency: '', duration_days: '' }],
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create prescription.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === 'DOCTOR' ? 'Prescriptions' : 'My Prescriptions'}
        </h1>
        {user?.role === 'DOCTOR' && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            + New Prescription
          </button>
        )}
      </div>

      {/* Create form — Doctor only */}
      {user?.role === 'DOCTOR' && showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">New Prescription</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕ Cancel</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Patient info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</p>
              {form.patient_name && (
                <p className="text-sm font-medium text-gray-800">{form.patient_name}</p>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Patient Profile ID</label>
                <input
                  name="patient_profile_id"
                  value={form.patient_profile_id}
                  onChange={handle}
                  required
                  placeholder="Auto-filled when coming from Dashboard"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use the "Write Rx" button from the Dashboard to auto-fill this.
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handle}
                required
                rows={3}
                placeholder="e.g. Mild hypertension with borderline LDL cholesterol"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Medications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Medications</label>
                <button type="button" onClick={addMed} className="text-xs text-blue-600 hover:underline">
                  + Add medication
                </button>
              </div>
              <div className="space-y-2">
                {form.medications.map((m, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-center">
                    <input
                      name="medicine_name"
                      placeholder="Medicine name *"
                      value={m.medicine_name}
                      onChange={e => handleMed(i, e)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="dosage"
                      placeholder="Dosage (e.g. 5mg)"
                      value={m.dosage}
                      onChange={e => handleMed(i, e)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="frequency"
                      placeholder="Frequency"
                      value={m.frequency}
                      onChange={e => handleMed(i, e)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        name="duration_days"
                        type="number"
                        placeholder="Days"
                        value={m.duration_days}
                        onChange={e => handleMed(i, e)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {form.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMed(i)}
                          className="text-red-400 hover:text-red-600 text-sm px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition"
            >
              {creating ? 'Saving…' : 'Create Prescription'}
            </button>
          </form>
        </div>
      )}

      {/* Prescriptions list */}
      <div className="space-y-4">
        {prescriptions.length === 0 && !showForm && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No prescriptions yet.</p>
            {user?.role === 'DOCTOR' && (
              <p className="text-sm mt-1">Go to Dashboard → click "Write Rx" next to a patient report.</p>
            )}
          </div>
        )}

        {prescriptions.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">{p.diagnosis}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(p.prescribed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className="text-xs text-gray-400 font-mono">#{p.id.slice(0, 8)}</span>
            </div>

            {Array.isArray(p.medications) && p.medications.filter(Boolean).length > 0 && (
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 uppercase tracking-wide">
                      <th className="px-3 py-2 text-left">Medicine</th>
                      <th className="px-3 py-2 text-left">Dosage</th>
                      <th className="px-3 py-2 text-left">Frequency</th>
                      <th className="px-3 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {p.medications.filter(Boolean).map((m, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-medium text-gray-800">{m.medicine_name}</td>
                        <td className="px-3 py-2 text-gray-600">{m.dosage || '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{m.frequency || '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{m.duration_days ? `${m.duration_days} days` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
