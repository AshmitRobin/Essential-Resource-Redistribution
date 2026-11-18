const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/25 disabled:bg-forest-50 disabled:text-muted';

export function Field({ label, error, hint, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input {...props} className={`${inputBase} ${error ? 'border-red-500' : 'border-line'}`} />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function SelectField({ label, error, hint, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select {...props} className={`${inputBase} ${error ? 'border-red-500' : 'border-line'}`}>{children}</select>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const variants = {
  primary: 'bg-forest-700 text-white hover:bg-forest-900 focus-visible:outline-forest-700',
  secondary: 'border border-line bg-white text-ink hover:bg-forest-50 focus-visible:outline-forest-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
};

export function Button({ variant = 'primary', loading = false, children, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && <Spinner small />}
      {children}
    </button>
  );
}

export function Alert({ type = 'error', children }) {
  const styles = type === 'success' ? 'border-forest-600/30 bg-forest-50 text-forest-900' : 'border-red-200 bg-red-50 text-red-800';
  return <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-3 py-2.5 text-sm ${styles}`}>{children}</div>;
}

const roleStyles = {
  Donor: 'bg-amber-100 text-amber-900',
  Beneficiary: 'bg-sky-100 text-sky-900',
  Admin: 'bg-violet-100 text-violet-900',
};
export const RoleBadge = ({ role }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[role]}`}>{role}</span>
);

export function Spinner({ small = false }) {
  const size = small ? 'h-4 w-4' : 'h-6 w-6';
  return <span className={`inline-block ${size} animate-spin rounded-full border-2 border-current border-t-transparent`} aria-label="Loading" />;
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
