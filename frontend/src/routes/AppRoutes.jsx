import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ChangePassword from '../pages/ChangePassword';
import Dashboard from '../pages/Dashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import Assets from '../pages/Assets';
import Employees from '../pages/Employees';
import Assignments from '../pages/Assignments';
import Maintenance from '../pages/Maintenance';
import Reports from '../pages/Reports';
import AIAssistant from '../pages/AIAssistant';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/admin/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/admin/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/employee/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/assets" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/employee/notifications" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/assets" element={<ProtectedRoute><Navigate to="/admin/assets" replace /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Navigate to="/admin/employees" replace /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><Navigate to="/admin/assignments" replace /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Navigate to="/admin/maintenance" replace /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Navigate to="/admin/reports" replace /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><Navigate to="/admin/ai" replace /></ProtectedRoute>} />
      <Route path="/employee-dashboard" element={<ProtectedRoute><Navigate to="/employee/dashboard" replace /></ProtectedRoute>} />
      <Route path="/my-assets" element={<ProtectedRoute><Navigate to="/employee/assets" replace /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Navigate to="/employee/notifications" replace /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Navigate to="/employee/profile" replace /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
