import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/employee-dashboard' || location.pathname === '/admin') {
    return <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} replace />;
  }

  const adminRoute = location.pathname.startsWith('/admin');
  const employeeRoute = location.pathname.startsWith('/employee');

  if (adminRoute && user?.role !== 'admin') {
    return <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/login'} replace />;
  }

  if (employeeRoute && user?.role !== 'employee') {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/login'} replace />;
  }

  return children;
}
