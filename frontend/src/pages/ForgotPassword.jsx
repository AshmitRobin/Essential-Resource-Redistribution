
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Alert, Button, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ForgotPassword() {
  const {
    startPasswordReset,
    verifyPasswordReset,
    resetPassword,
  } = useAuth();

  const [step, setStep] = useState('identify');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return setError('Enter a valid email address.');
    }

    setBusy(true);

    try {
      const result = await startPasswordReset(email.trim());
      setMessage(result.message);
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(code)) {
      return setError('Enter the six-digit code sent to your email.');
    }

    setBusy(true);

    try {
      const result = await verifyPasswordReset(email.trim(), code);
      setResetToken(result.resetToken);
      setStep('new-password');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setError('');

    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return setError(
        'Use at least 8 characters with a letter and a number.'
      );
    }

    if (password !== confirm) {
      return setError('Passwords do not match.');
    }

    setBusy(true);

    try {
      await resetPassword(resetToken, password);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={
        step === 'identify'
          ? 'Reset your password'
          : step === 'verify'
            ? 'Verify your email'
            : step === 'new-password'
              ? 'Create a new password'
              : 'Password updated'
      }
      subtitle="Securely recover access to your ERR account."
    >
      {error && <Alert>{error}</Alert>}

      {message && <Alert type="success">{message}</Alert>}

      {step === 'identify' && (
        <form onSubmit={send} className="mt-5 space-y-4">
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <p className="text-xs text-blue">
            A six-digit password recovery code will be sent to your registered email address.
          </p>

          <Button
            type="submit"
            loading={busy}
            className="w-full"
          >
            {busy ? 'Sending code…' : 'Send email verification code'}
          </Button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={verify} className="mt-5 space-y-4">
          <p className="text-sm text-blue">
            Enter the six-digit code sent to {email}.
          </p>

          <Field
            label="Email verification code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
          />

          <Button
            type="submit"
            loading={busy}
            className="w-full"
          >
            {busy ? 'Verifying…' : 'Verify code'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep('identify');
              setError('');
              setMessage('');
              setCode('');
            }}
            className="w-full text-sm font-semibold text-french underline"
          >
            Use a different email address
          </button>
        </form>
      )}

      {step === 'new-password' && (
        <form onSubmit={save} className="mt-5 space-y-4">
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="At least 8 characters with a letter and a number."
          />

          <Field
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            type="submit"
            loading={busy}
            className="w-full"
          >
            {busy ? 'Updating password…' : 'Update password'}
          </Button>
        </form>
      )}

      {step === 'done' && (
        <div className="mt-5 space-y-4">
          <Alert type="success">
            Your password has been changed successfully.
          </Alert>

          <Link
            to="/login"
            className="block rounded-xl bg-french px-4 py-3 text-center font-semibold text-white"
          >
            Return to login
          </Link>
        </div>
      )}

      {step !== 'done' && (
        <p className="mt-6 text-sm text-blue">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-bold text-french underline"
          >
            Log in
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
