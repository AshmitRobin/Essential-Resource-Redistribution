import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from './components/Routes.jsx';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AdminUsers from './pages/AdminUsers.jsx';

const NotFound = () => (
  <div className="mx-auto max-w-md py-24 text-center">
    <h1 className="font-display text-2xl font-bold">Page not found</h1>
    <Link to="/dashboard" className="mt-4 inline-block font-semibold text-french underline">Go to your dashboard</Link>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
          {/* Next modules: add their routes here (resources, requests, categories...) */}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
