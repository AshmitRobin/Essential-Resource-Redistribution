
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const roles = [
  ['Donor', 'I have items to share'],
  ['Beneficiary', 'I need items'],
];

function validate(f) {
  const e = {};

  if (f.name.trim().length < 2) {
    e.name = 'Enter your name (at least 2 characters)';
  }

  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
    e.email = 'Enter a valid email address';
  }

  if (f.mobile && !/^[0-9]{10,15}$/.test(f.mobile)) {
    e.mobile = 'Mobile must be 10 to 15 digits';
  }

  if (
    f.password.length < 8 ||
    !/[A-Za-z]/.test(f.password) ||
    !/[0-9]/.test(f.password)
  ) {
    e.password =
      'Use at least 8 characters with a letter and a number';
  }

  if (f.confirm !== f.password) {
    e.confirm = 'Passwords do not match';
  }

  return e;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Donor',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});
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

    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length) return;

    setBusy(true);

    try {
      const { confirm, ...payload } = form;

      await register(payload);

      navigate('/dashboard', {
        replace: true,
      });
    } catch (err) {
      setErrors(err.errors || {});
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Join the community."
      subtitle="Create your account and start making a difference through resource sharing."
    >
      <form
        onSubmit={submit}
        className="space-y-4"
        noValidate
      >
        {error && <Alert>{error}</Alert>}

        {/* ACCOUNT ROLE */}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ink">
            How would you like to participate?
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {roles.map(([value, hint]) => (
              <label
                key={value}
                className={`
                  cursor-pointer rounded-xl border p-4
                  transition duration-200
                  ${
                    form.role === value
                      ? 'border-forest-600 bg-forest-50'
                      : 'border-line bg-[var(--surface)] hover:bg-forest-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={form.role === value}
                  onChange={set}
                  className="sr-only"
                />

                <span className="block text-sm font-bold">
                  {value}
                </span>

                <span className="mt-1 block text-xs text-muted">
                  {hint}
                </span>

                {form.role === value && (
                  <span className="mt-3 block text-xs font-bold text-forest-700">
                    ✓ Selected
                  </span>
                )}
              </label>
            ))}
          </div>

          {errors.role && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.role}
            </span>
          )}
        </fieldset>

        <Field
          label="Full name"
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          value={form.name}
          onChange={set}
          error={errors.name}
        />

        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={set}
          error={errors.email}
        />

        <Field
          label="Mobile number (optional)"
          name="mobile"
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
          autoComplete="tel"
          value={form.mobile}
          onChange={set}
          error={errors.mobile}
          hint="Enter 10 to 15 digits."
        />

        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={form.password}
          onChange={set}
          error={errors.password}
          hint="At least 8 characters, including a letter and a number."
        />

        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={set}
          error={errors.confirm}
        />

        <Button
          type="submit"
          loading={busy}
          className="w-full"
        >
          {busy ? 'Creating account...' : 'Create your account'}
          {!busy && <span aria-hidden="true">→</span>}
        </Button>
      </form>

      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm text-muted">
          Already a member?{' '}
          <Link
            to="/login"
            className="font-bold text-forest-700 underline decoration-forest-600/40 underline-offset-4 hover:decoration-forest-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
