import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { RoleBadge } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// "to" means the feature exists now; otherwise it arrives with the named module
const tasks = {
  Donor: [
    { title: 'Update your details', text: 'Keep your name and mobile number current.', to: '/profile' },
    { title: 'List a resource', text: 'Add items you can share, with category and quantity.', module: 'Resource Management' },
    { title: 'Respond to requests', text: 'Accept or reject requests for your listings.', module: 'Request Approval' },
  ],
  Beneficiary: [
    { title: 'Update your details', text: 'Keep your name and mobile number current.', to: '/profile' },
    { title: 'Browse available resources', text: 'Search and filter what donors have listed.', module: 'Resource Browsing & Search' },
    { title: 'Request an item', text: 'Ask for a listed item and the quantity you need.', module: 'Request Management' },
  ],
  Admin: [
    { title: 'Manage users', text: 'Review, update or remove user accounts.', to: '/admin/users' },
    { title: 'Maintain categories', text: 'Keep the list of resource categories up to date.', module: 'Category Management' },
    { title: 'Review listings and records', text: 'Oversee listings, requests and distributions.', module: 'Admin Management' },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.role === 'Admin') api.get('/users/stats').then(setStats).catch(() => {});
  }, [user.role]);

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-muted">{user.email}{user.mobile ? ` · ${user.mobile}` : ''}</p>
        </div>
        <RoleBadge role={user.role} />
      </section>

      {stats && (
        <section aria-label="Accounts by role" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {[['Donors', stats.stats.Donor], ['Beneficiaries', stats.stats.Beneficiary], ['Administrators', stats.stats.Admin], ['All accounts', stats.total]].map(([label, n]) => (
            <div key={label} className="bg-white px-5 py-4">
              <div className="text-2xl font-semibold">{n}</div>
              <div className="text-sm text-muted">{label}</div>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">What you can do</h2>
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {tasks[user.role].map((t) => (
            <li key={t.title} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-muted">{t.text}</div>
              </div>
              {t.to ? (
                <Link to={t.to} className="rounded-lg bg-forest-700 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-forest-900">Open</Link>
              ) : (
                <span className="rounded-full bg-forest-50 px-3 py-1 text-xs text-muted">Available with {t.module}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
