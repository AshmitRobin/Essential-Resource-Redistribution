import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const roles = [
  ['Donor', 'I have items to share', '✦'],
  ['Beneficiary', 'I need items', '◈'],
];

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters)';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (f.mobile && !/^\+[1-9]\d{7,14}$/.test(f.mobile)) e.mobile = 'Use international format, e.g. +919876543210';
  if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/[0-9]/.test(f.password)) {
    e.password = 'Use at least 8 characters with a letter and a number';
  }
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
  return e;
}

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) score++;
  return score; // 0 to 3
}

export default function Register() {
  const { startRegistration, verifyRegistration } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', role: 'Donor', password: '', confirm: '' });
  const [code, setCode] = useState('');
  const [step, setStep] = useState('details');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  const strength = getPasswordStrength(form.password);

  async function sendCode(e) {
    e.preventDefault();
    setError('');
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const { confirm, ...payload } = form;
      await startRegistration(payload);
      setStep('verify');
    } catch (err) {
      setErrors(err.errors || {});
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) return setError('Enter the six-digit code sent to your email.');
    setBusy(true);
    try {
      await verifyRegistration(form.email, code);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow={step === 'details' ? 'CREATE ACCOUNT' : 'VERIFY EMAIL'}
      title={step === 'details' ? 'Join the network' : 'Check your inbox'}
      subtitle={
        step === 'details'
          ? 'Start sharing or receiving essential resources in your community.'
          : `Enter the 6-digit code we just sent to ${form.email}.`
      }
    >
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {step === 'details' ? (
        <form onSubmit={sendCode} className="space-y-3.5" noValidate>
          <fieldset>
            <legend className="mb-2 text-[13px] font-bold text-violet">
              Choose your role
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(([value, hint, icon]) => {
                const active = form.role === value;
                return (
                  <label
                    key={value}
                    className={`role-tile ${active ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={active}
                      onChange={set}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-extrabold text-violet">
                        {value}
                      </span>
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold transition ${
                          active
                            ? 'bg-violet text-wheat'
                            : 'bg-seashell text-french'
                        }`}
                      >
                        {icon}
                      </span>
                    </div>
                    <span className="mt-1 block text-xs font-medium text-french">
                      {hint}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Field
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={set}
            error={errors.name}
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set}
            error={errors.email}
          />
          <Field
            label="Mobile number (optional)"
            name="mobile"
            type="tel"
            placeholder="+919876543210"
            autoComplete="tel"
            value={form.mobile}
            onChange={set}
            error={errors.mobile}
          />

          <div>
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set}
              error={errors.password}
            />
            {form.password.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      strength >= lvl
                        ? lvl === 3
                          ? 'bg-violet'
                          : lvl === 2
                          ? 'bg-french'
                          : 'bg-powder'
                        : 'bg-line'
                    }`}
                  />
                ))}
                <span className="ml-1 text-[11px] font-bold text-french">
                  {strength === 3 ? 'Strong' : strength === 2 ? 'Good' : 'Weak'}
                </span>
              </div>
            )}
          </div>

          <Field
            label="Confirm password"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set}
            error={errors.confirm}
          />

          <Button type="submit" loading={busy} className="mt-2 w-full">
            {busy ? 'Sending code…' : 'Continue to verification'} →
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <Field
            label="6-digit verification code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <Button type="submit" loading={busy} className="w-full">
            {busy ? 'Verifying…' : 'Verify & enter dashboard'} →
          </Button>
          <button
            type="button"
            className="w-full pt-1 text-center text-xs font-bold text-french underline underline-offset-4 hover:text-violet"
            onClick={() => {
              setStep('details');
              setCode('');
              setError('');
            }}
          >
            ← Back to registration details
          </button>
        </form>
      )}

      <p className="mt-5 border-t border-line pt-4 text-center text-sm text-french">
        Already have an account?{' '}
        <Link to="/login" className="font-extrabold text-violet underline decoration-french decoration-2 underline-offset-4 hover:text-french">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
