import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Prescriptions from './pages/Prescriptions';
import Notifications from './pages/Notifications';
import AdminUsers from './pages/AdminUsers';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute roles={['PATIENT']}><Reports /></PrivateRoute>} />
        <Route path="/prescriptions" element={<PrivateRoute roles={['PATIENT', 'DOCTOR']}><Prescriptions /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute roles={['PATIENT', 'DOCTOR']}><Notifications /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['ADMIN']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/audit" element={<PrivateRoute roles={['ADMIN']}><AuditLogs /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </div>
  );
}
