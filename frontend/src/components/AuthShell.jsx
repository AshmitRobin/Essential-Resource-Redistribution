
import { useEffect, useState } from 'react';

const audiences = [
  {
    number: '01',
    term: 'Donors',
    text: 'Give usable items a second life by sharing what you no longer need.',
    icon: '↗',
  },
  {
    number: '02',
    term: 'Beneficiaries',
    text: 'Find useful resources and connect with people ready to help.',
    icon: '◇',
  },
  {
    number: '03',
    term: 'Administrators',
    text: 'Keep resources, accounts and redistribution organised.',
    icon: '◎',
  },
];

function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon">
        {dark ? '☀' : '☾'}
      </span>
      <span className="theme-toggle-label">
        {dark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
}

export default function AuthShell({ title, subtitle, children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('errs-theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    try {
      localStorage.setItem('errs-theme', theme);
    } catch {
      // Theme still works for the current session.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="auth-layout">

      {/* LEFT INTRODUCTION PANEL */}
      <aside className="auth-visual">

        <div className="visual-decoration visual-decoration-one" />
        <div className="visual-decoration visual-decoration-two" />

        <div className="visual-content">

          <div className="visual-eyebrow">
            <span className="eyebrow-dot" />
            A COMMUNITY THAT SHARES
          </div>

          <div className="visual-heading">
            <h1>
              Good things
              <br />
              deserve a
              <br />
              <span>second life.</span>
            </h1>

            <p className="visual-description">
              Connecting people who have extra resources
              with those who need them. Less waste,
              more possibilities.
            </p>
          </div>

          <div className="visual-card">
            <div className="visual-card-header">
              <span>HOW IT WORKS</span>
              <span className="visual-card-arrow">↗</span>
            </div>

            <div className="audience-list">
              {audiences.map((item) => (
                <div className="audience-item" key={item.term}>
                  <div className="audience-number">
                    {item.number}
                  </div>

                  <div className="audience-info">
                    <h3>{item.term}</h3>
                    <p>{item.text}</p>
                  </div>

                  <div className="audience-icon">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="visual-bottom">
            <span>SHARE MORE. WASTE LESS.</span>
            <span>MADE FOR IMPACT.</span>
          </div>

        </div>
      </aside>

      {/* RIGHT AUTHENTICATION PANEL */}
      <main className="auth-main">

        <div className="auth-topbar">
          <div className="auth-top-label">
            <span className="auth-status-dot" />
            YOUR COMMUNITY STARTS HERE
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
          />
        </div>

        <div className="auth-form-wrapper">

          <div className="form-intro">
            <div className="form-overline">
              WELCOME
            </div>

            <h2>{title}</h2>

            <p>{subtitle}</p>
          </div>

          <div className="auth-form-content">
            {children}
          </div>

          <div className="auth-security-note">
            <span>◇</span>
            A better way to share resources and make a difference.
          </div>

        </div>

        <footer className="auth-footer">
          <span>ESSENTIAL RESOURCE REDISTRIBUTION</span>
          <span>© {new Date().getFullYear()} · ALL RIGHTS RESERVED</span>
        </footer>

      </main>
    </div>
  );
}
