import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) return setError('Enter your email and password');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Log in" subtitle="Use the email and password you registered with.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={set} />
        <div><Field label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={set} /><div className="mt-2 text-right"><Link to="/forgot-password" className="text-sm font-semibold text-french underline underline-offset-4">Forgot password?</Link></div></div>
        <Button type="submit" loading={busy} className="w-full">Log in</Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        New here? <Link to="/register" className="font-semibold text-french underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
