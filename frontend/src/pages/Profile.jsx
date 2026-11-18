import { useState } from 'react';
import { api } from '../api/client.js';
import { Alert, Button, Field, RoleBadge } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Details() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, mobile: user.mobile || '' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setBusy(true);
    try {
      const d = await api.put('/users/me', form);
      setUser(d.user);
      setErrors({});
      setMsg({ type: 'success', text: 'Details saved' });
    } catch (err) {
      setErrors(err.errors || {});
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-line bg-white p-6" noValidate>
      <h2 className="font-display text-xl font-bold">Your details</h2>
      {msg.text && <Alert type={msg.type}>{msg.text}</Alert>}
      <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <Field label="Mobile" type="tel" inputMode="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} error={errors.mobile} hint="Use international format for SMS recovery, e.g. +919876543210. Leave empty to remove it." />
      <Field label="Email" value={user.email} disabled hint="Your email is your login and cannot be changed here." />
      <div className="flex items-center gap-2 text-sm"><span className="font-medium">Role</span><RoleBadge role={user.role} /></div>
      <Button type="submit" loading={busy}>Save changes</Button>
    </form>
  );
}

function Password() {
  const empty = { currentPassword: '', newPassword: '', confirm: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (form.newPassword !== form.confirm) return setErrors({ confirm: 'Passwords do not match' });
    setBusy(true);
    try {
      await api.put('/users/me/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm(empty);
      setErrors({});
      setMsg({ type: 'success', text: 'Password updated' });
    } catch (err) {
      setErrors(err.errors || {});
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-line bg-white p-6" noValidate>
      <h2 className="font-display text-xl font-bold">Change password</h2>
      {msg.text && <Alert type={msg.type}>{msg.text}</Alert>}
      <Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" value={form.currentPassword} onChange={set} error={errors.currentPassword} />
      <Field label="New password" name="newPassword" type="password" autoComplete="new-password" value={form.newPassword} onChange={set} error={errors.newPassword} hint="At least 8 characters with a letter and a number" />
      <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set} error={errors.confirm} />
      <Button type="submit" loading={busy}>Update password</Button>
    </form>
  );
}

export default function Profile() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Profile</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Details />
        <Password />
      </div>
    </div>
  );
}
