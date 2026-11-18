import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const roles = [['Donor', 'I have items to share'], ['Beneficiary', 'I need items']];
function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters)';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (f.mobile && !/^\+[1-9]\d{7,14}$/.test(f.mobile)) e.mobile = 'Use international format, e.g. +919876543210';
  if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/[0-9]/.test(f.password)) e.password = 'Use at least 8 characters with a letter and a number';
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
  return e;
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

  async function sendCode(e) {
    e.preventDefault(); setError('');
    const found = validate(form); setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const { confirm, ...payload } = form;
      await startRegistration(payload);
      setStep('verify');
    } catch (err) { setErrors(err.errors || {}); setError(err.message); }
    finally { setBusy(false); }
  }
  async function verify(e) {
    e.preventDefault(); setError('');
    if (!/^\d{6}$/.test(code)) return setError('Enter the six-digit code sent to your email.');
    setBusy(true);
    try { await verifyRegistration(form.email, code); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <AuthShell title={step === 'details' ? 'Create your account' : 'Verify your email'} subtitle={step === 'details' ? 'Join the community and help useful resources reach the people who need them.' : `We sent a six-digit verification code to ${form.email}.`}>
    {error && <Alert>{error}</Alert>}
    {step === 'details' ? <form onSubmit={sendCode} className="mt-5 space-y-4" noValidate>
      <fieldset><legend className="mb-2 text-sm font-semibold text-ink">I am registering as</legend><div className="grid grid-cols-2 gap-3">{roles.map(([value, hint]) => <label key={value} className={`cursor-pointer rounded-xl border p-3 transition ${form.role === value ? 'border-french bg-wheat/50' : 'border-line bg-white hover:bg-seashell'}`}><input type="radio" name="role" value={value} checked={form.role === value} onChange={set} className="sr-only"/><span className="block text-sm font-bold text-violet">{value}</span><span className="mt-1 block text-xs text-blue">{hint}</span></label>)}</div></fieldset>
      <Field label="Full name" name="name" autoComplete="name" value={form.name} onChange={set} error={errors.name}/>
      <Field label="Email address" name="email" type="email" autoComplete="email" value={form.email} onChange={set} error={errors.email}/>
      <Field label="Mobile number (optional)" name="mobile" type="tel" placeholder="+919876543210" autoComplete="tel" value={form.mobile} onChange={set} error={errors.mobile} hint="Optional contact number. It is not used for OTP verification."/>
      <Field label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set} error={errors.password} hint="At least 8 characters, including a letter and a number."/>
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set} error={errors.confirm}/>
      <Button type="submit" loading={busy} className="w-full">{busy ? 'Sending verification code…' : 'Continue to email verification'} →</Button>
    </form> : <form onSubmit={verify} className="mt-5 space-y-4">
      <Field label="Six-digit email verification code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}/>
      <Button type="submit" loading={busy} className="w-full">{busy ? 'Verifying…' : 'Verify email and create account'}</Button>
      <button type="button" className="w-full text-sm font-semibold text-french underline" onClick={() => { setStep('details'); setCode(''); setError(''); }}>Back to registration details</button>
    </form>}
    <p className="mt-6 text-sm text-blue">Already registered? <Link to="/login" className="font-bold text-french underline">Log in</Link></p>
  </AuthShell>;
}
