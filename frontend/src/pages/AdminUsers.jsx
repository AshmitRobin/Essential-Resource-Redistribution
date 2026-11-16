import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Alert, Button, Field, Modal, RoleBadge, SelectField, Spinner } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function EditModal({ user, isSelf, onClose, onSaved }) {
  const [form, setForm] = useState({ name: user.name, mobile: user.mobile || '', role: user.role });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put(`/users/${user._id}`, form);
      onSaved(`Saved changes for ${form.name}`);
    } catch (err) {
      setErrors(err.errors || {});
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Edit user" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="Full name" name="name" value={form.name} onChange={set} error={errors.name} />
        <Field label="Mobile" name="mobile" inputMode="numeric" value={form.mobile} onChange={set} error={errors.mobile} />
        <Field label="Email" value={user.email} disabled />
        <SelectField label="Role" name="role" value={form.role} onChange={set} disabled={isSelf} error={errors.role} hint={isSelf ? 'You cannot change your own role.' : undefined}>
          <option>Donor</option>
          <option>Beneficiary</option>
          <option>Admin</option>
        </SelectField>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={busy}>Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ user, onClose, onDeleted }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await api.del(`/users/${user._id}`);
      onDeleted(`Deleted ${user.name}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Delete this user?" onClose={onClose}>
      {error && <div className="mb-3"><Alert>{error}</Alert></div>}
      <p className="text-sm text-muted"><span className="font-semibold text-ink">{user.name}</span> ({user.email}) will lose access. This cannot be undone.</p>
      <div className="flex justify-end gap-3 pt-5">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={busy} onClick={confirm}>Delete user</Button>
      </div>
    </Modal>
  );
}

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (role) params.set('role', role);
        const d = await api.get(`/users?${params}`);
        setUsers(d.users);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, role, reload]);

  const done = (text) => { setEditing(null); setDeleting(null); setNotice(text); setReload((n) => n + 1); };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <p className="mt-1 mb-6 text-muted">Review accounts, update their details or roles, and remove users who should no longer have access.</p>

      <div className="mb-4 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" aria-label="Search users"
          className="min-w-64 flex-1 rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/25" />
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role"
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/25">
          <option value="">All roles</option>
          <option>Donor</option>
          <option>Beneficiary</option>
          <option>Admin</option>
        </select>
      </div>

      {notice && <div className="mb-4"><Alert type="success">{notice}</Alert></div>}
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-forest-50 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-10 text-center text-forest-700"><Spinner /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-10 text-center text-muted">No users match this search. Clear the search or choose another role.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-medium">{u.name}{u._id === me._id && <span className="ml-2 text-xs text-muted">(you)</span>}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 text-muted">{u.mobile || '-'}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-muted">{fmt(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setNotice(''); setEditing(u); }} className="mr-4 font-semibold text-forest-700 hover:underline">Edit</button>
                    {u.role !== 'Admin' && <button onClick={() => { setNotice(''); setDeleting(u); }} className="font-semibold text-red-600 hover:underline">Delete</button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && <EditModal user={editing} isSelf={editing._id === me._id} onClose={() => setEditing(null)} onSaved={done} />}
      {deleting && <DeleteModal user={deleting} onClose={() => setDeleting(null)} onDeleted={done} />}
    </div>
  );
}
