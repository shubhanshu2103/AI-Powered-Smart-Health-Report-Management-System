import { useAuth } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'PATIENT') return <PatientDashboard />;
  if (user?.role === 'DOCTOR') return <DoctorDashboard />;
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  return null;
}
