
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      return setError('Enter your email and password');
    }

    setBusy(true);

    try {
      await login(form.email, form.password);

      navigate(location.state?.from || '/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to continue connecting resources with the people who need them."
    >
      <form
        onSubmit={submit}
        className="space-y-5"
        noValidate
      >
        {error && <Alert>{error}</Alert>}

        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={set}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={form.password}
          onChange={set}
        />

        <Button
          type="submit"
          loading={busy}
          className="w-full"
        >
          {busy ? 'Signing in...' : 'Log in to your account'}
          {!busy && <span aria-hidden="true">→</span>}
        </Button>
      </form>

      <div className="mt-7 border-t border-line pt-6">
        <p className="text-sm text-muted">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-forest-700 underline decoration-forest-600/40 underline-offset-4 hover:decoration-forest-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
