import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from './ui.jsx';

const Centered = ({ children }) => <div className="flex min-h-screen items-center justify-center text-forest-700">{children}</div>;

// Only logged-in users get in; pass roles={['Admin']} to limit by role
export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Centered><Spinner /></Centered>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-2xl font-bold">You do not have access to this page</h1>
        <p className="mt-2 text-muted">This page is only for {roles.join(' and ')} accounts.</p>
        <Link to="/dashboard" className="mt-5 inline-block font-semibold text-forest-700 underline">Back to your dashboard</Link>
      </div>
    );
  }
  return <Outlet />;
}

// Login and register pages are skipped when already logged in
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Centered><Spinner /></Centered>;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
