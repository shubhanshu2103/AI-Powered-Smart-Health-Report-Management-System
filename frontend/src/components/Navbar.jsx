import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold tracking-wide">
          SmartMed
        </Link>
        {user && (
          <div className="flex items-center gap-6 text-sm">
            {user.role === 'PATIENT' && (
              <>
                <Link to="/reports" className="hover:text-blue-200">Reports</Link>
                <Link to="/prescriptions" className="hover:text-blue-200">Prescriptions</Link>
                <Link to="/notifications" className="hover:text-blue-200">Notifications</Link>
              </>
            )}
            {user.role === 'DOCTOR' && (
              <>
                <Link to="/prescriptions" className="hover:text-blue-200">Prescriptions</Link>
                <Link to="/notifications" className="hover:text-blue-200">Notifications</Link>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin/users" className="hover:text-blue-200">Users</Link>
                <Link to="/admin/audit" className="hover:text-blue-200">Audit Logs</Link>
              </>
            )}
            <span className="text-blue-200">{user.full_name} ({user.role})</span>
            <button onClick={handleLogout} className="bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
