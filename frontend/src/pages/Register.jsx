import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'PATIENT', specialization: '', license_number: '', date_of_birth: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { email: form.email, password: form.password, full_name: form.full_name, role: form.role };
      if (form.role === 'DOCTOR') { payload.specialization = form.specialization; payload.license_number = form.license_number; }
      if (form.role === 'PATIENT') { payload.date_of_birth = form.date_of_birth || undefined; payload.gender = form.gender || undefined; }
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">SmartMed</h1>
        <h2 className="text-lg font-semibold mb-4">Create Account</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handle} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handle} required minLength={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="role" value={form.role} onChange={handle}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>

          {form.role === 'DOCTOR' && (
            <>
              <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="license_number" placeholder="License Number" value={form.license_number} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </>
          )}

          {form.role === 'PATIENT' && (
            <>
              <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select name="gender" value={form.gender} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 transition">
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
