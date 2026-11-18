import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, RoleBadge } from './ui.jsx';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${isActive ? 'bg-forest-100 text-forest-900' : 'text-muted hover:text-ink'}`;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/dashboard" className="font-display text-xl font-bold text-forest-900">ERR</NavLink>
          <nav className="flex flex-1 items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            {user.role === 'Admin' && <NavLink to="/admin/users" className={linkClass}>Users</NavLink>}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:inline">{user.name}</span>
            <RoleBadge role={user.role} />
            <Button variant="secondary" className="!px-3 !py-1.5" onClick={() => { logout(); navigate('/login'); }}>Log out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
