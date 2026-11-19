import { useState } from 'react';

const inputBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-violet outline-none transition placeholder:text-french/45 focus:border-french focus:ring-3 focus:ring-french/20 disabled:bg-seashell disabled:text-french/60';

export function Field({ label, error, hint, type = 'text', className = '', ...props }) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPwd ? 'text' : 'password') : type;

  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-bold text-violet">{label}</span>
      <div className="relative">
        <input
          {...props}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          className={`${inputBase} ${isPassword ? 'pr-16' : ''} ${
            error
              ? 'border-[#a3263d] focus:border-[#a3263d] focus:ring-[#a3263d]/20'
              : 'border-line hover:border-powder'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg bg-seashell px-2 py-1 text-[11px] font-bold text-french transition hover:bg-wheat hover:text-violet"
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-[#a3263d]">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-french/80">{hint}</span>
      ) : null}
    </label>
  );
}

export function SelectField({ label, error, hint, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-bold text-violet">{label}</span>
      <select
        {...props}
        aria-invalid={Boolean(error)}
        className={`${inputBase} ${
          error
            ? 'border-[#a3263d] focus:border-[#a3263d] focus:ring-[#a3263d]/20'
            : 'border-line hover:border-powder'
        }`}
      >
        {children}
      </select>
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-[#a3263d]">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-french/80">{hint}</span>
      ) : null}
    </label>
  );
}

const variants = {
  primary:
    'bg-gradient-to-br from-violet to-french text-seashell shadow-lg shadow-violet/25 hover:brightness-110 focus-visible:outline-french',
  secondary:
    'border border-line bg-white text-violet hover:border-french hover:bg-seashell focus-visible:outline-french',
  accent:
    'border border-violet/20 bg-wheat text-violet hover:bg-wheat/80 focus-visible:outline-french',
  danger:
    'bg-[#a3263d] text-seashell hover:bg-[#881d31] focus-visible:outline-[#a3263d]',
};

export function Button({ variant = 'primary', loading = false, children, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && <Spinner small />}
      {children}
    </button>
  );
}

export function Alert({ type = 'error', children }) {
  const styles =
    type === 'success'
      ? 'border-french/30 bg-wheat/65 text-violet'
      : 'border-[#a3263d]/30 bg-[#fdf2f4] text-[#881d31]';

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-3.5 py-2.5 text-sm font-semibold ${styles}`}
    >
      {children}
    </div>
  );
}

const roleStyles = {
  Donor: 'border border-violet/20 bg-wheat text-violet',
  Beneficiary: 'border border-french/30 bg-powder/40 text-violet',
  Admin: 'border border-violet bg-violet text-wheat',
};

export const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold tracking-wide ${
      roleStyles[role] || roleStyles.Donor
    }`}
  >
    {role}
  </span>
);

export function Spinner({ small = false }) {
  const size = small ? 'h-4 w-4' : 'h-6 w-6';
  return (
    <span
      className={`inline-block ${size} animate-spin rounded-full border-2 border-current border-t-transparent`}
      aria-label="Loading"
    />
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-violet/55 p-4 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-3xl border border-white bg-seashell p-6 shadow-2xl"
      >
        <h2 className="mb-4 font-display text-xl font-extrabold text-violet">{title}</h2>
        {children}
      </div>
    </div>
  );
}
