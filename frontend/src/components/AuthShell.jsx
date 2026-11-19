import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const audiences = [
  {
    id: '01',
    role: 'Donors',
    tag: 'SHARE',
    text: 'Give usable items a second life by sharing what you no longer need.',
    rowVariant: 'audience-row-01',
    badgeClass: 'bg-gradient-to-br from-violet to-french text-wheat',
    tagClass: 'bg-wheat text-violet border-violet/15',
  },
  {
    id: '02',
    role: 'Beneficiaries',
    tag: 'RECEIVE',
    text: 'Find useful resources and connect directly with people ready to help.',
    rowVariant: 'audience-row-02',
    badgeClass: 'bg-gradient-to-br from-french to-violet text-seashell',
    tagClass: 'bg-[#f8dcc8] text-violet border-violet/15',
  },
  {
    id: '03',
    role: 'Administrators',
    tag: 'ORGANISE',
    text: 'Keep resources, accounts, and redistribution organised seamlessly.',
    rowVariant: 'audience-row-03',
    badgeClass: 'bg-violet text-wheat',
    tagClass: 'bg-violet/12 text-violet border-violet/20',
  },
];

function FourPointStar({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden="true">
      <path d="M50 0 C53 33, 67 47, 100 50 C67 53, 53 67, 50 100 C47 67, 33 53, 0 50 C33 47, 47 33, 50 0 Z" />
    </svg>
  );
}

export default function AuthShell({ title, subtitle, eyebrow = 'WELCOME', children }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [spot, setSpot] = useState({ x: '35%', y: '45%' });
  const { pathname } = useLocation();
  const isRegister = pathname.includes('register');

  function handleMouseMove(e) {
    setSpot({ x: `${e.clientX}px`, y: `${e.clientY}px` });
  }

  return (
    <div
      className="editorial-stage"
      onMouseMove={handleMouseMove}
      style={{ '--mx': spot.x, '--my': spot.y }}
    >
      {/* Warm Seashell & Peach-Wheat silk aurora layers + fine print grain */}
      <div className="aurora-ribbon-warm" aria-hidden="true" />
      <div className="aurora-ribbon-peach" aria-hidden="true" />
      <div className="editorial-grid" aria-hidden="true" />
      <div className="editorial-spotlight" aria-hidden="true" />
      <div className="editorial-grain" aria-hidden="true" />

      {/* Architectural orbital ring + warm Wheat 4-point star watermarks */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-56 -left-56 z-0 h-[720px] w-[720px] rounded-full border border-violet/10"
      />
      <FourPointStar
        className="pointer-events-none fixed -bottom-32 -left-32 z-0 h-[500px] w-[500px] text-wheat opacity-95"
      />
      <FourPointStar
        className="pointer-events-none fixed top-20 right-[38%] z-0 h-52 w-52 rotate-12 text-wheat opacity-65"
      />

      {/* Pill-Shaped Frosted Top Navigation */}
      <header className="editorial-nav">
        <div className="flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet to-french text-wheat shadow-md shadow-violet/25 ring-1 ring-white/60">
            <FourPointStar className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-extrabold tracking-[0.22em] text-violet">
              ERR
            </span>
            <span className="hidden h-4 w-[1.5px] bg-violet/20 sm:inline-block" aria-hidden="true" />
            <span className="hidden text-[11px] font-bold tracking-[0.16em] text-french sm:inline">
              ESSENTIAL RESOURCE REDISTRIBUTION
            </span>
          </div>
        </div>

        {/* Consistent-Spaced Mode Switcher */}
        <nav aria-label="Authentication mode" className="flex items-center gap-1.5 rounded-full bg-seashell/95 p-1.5 border border-violet/12 shadow-inner">
          <Link
            to="/login"
            className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-all ${
              !isRegister
                ? 'bg-gradient-to-r from-violet to-french text-seashell shadow-sm'
                : 'text-french hover:text-violet'
            }`}
          >
            Log in
          </Link>
          <Link
            to="/register"
            className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-all ${
              isRegister
                ? 'bg-gradient-to-r from-violet to-french text-seashell shadow-sm'
                : 'text-french hover:text-violet'
            }`}
          >
            Create account
          </Link>
        </nav>
      </header>

      {/* Main Asymmetric Editorial Layout */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-[1220px] grid-cols-1 items-center gap-10 py-6 lg:grid-cols-12 lg:gap-12">
        {/* Left 7 Columns: Large Headline, Readable Supporting Copy & Distinct Feature Cards */}
        <section className="hidden flex-col justify-center lg:col-span-7 lg:flex">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-wheat to-seashell px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-violet border border-white shadow-sm">
            <FourPointStar className="h-3 w-3 text-french" />
            <span>A COMMUNITY THAT SHARES</span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-violet xl:text-[62px]">
            Good things deserve a{' '}
            <span className="relative inline-block text-french">
              second life.
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-0 -z-10 h-4 w-full rounded-md bg-gradient-to-r from-wheat via-wheat to-[#f9dec9]"
              />
            </span>
          </h1>

          {/* Higher-contrast, slightly larger supporting paragraph */}
          <p className="mt-5 max-w-xl text-[17px] font-medium leading-[1.65] text-violet/85">
            Connecting people who have extra resources with those who need
            them. Less waste, more possibilities.
          </p>

          {/* Distinct Feature Cards with Prominent Numbered Icons & Hover Lift */}
          <div className="mt-8 max-w-xl space-y-3.5">
            {audiences.map((item, idx) => {
              const active = activeIdx === idx;
              return (
                <div
                  key={item.role}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className={`group audience-row ${item.rowVariant} ${active ? 'is-active' : ''}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Prominent Numbered Emblem */}
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold shadow-md ring-2 ring-white/80 transition-transform duration-300 group-hover:scale-105 ${item.badgeClass}`}
                      >
                        {item.id}
                      </span>
                      <h3 className="font-display text-lg font-extrabold tracking-tight text-violet">
                        {item.role}
                      </h3>
                    </div>

                    {/* Darker, Crisp Action Label */}
                    <span
                      className={`rounded-full border px-3 py-1 text-[10.5px] font-extrabold tracking-[0.18em] transition-colors ${item.tagClass}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <p className="mt-2 pl-[52px] text-[14.5px] font-medium leading-relaxed text-violet/80">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 5 Columns: Rim-Lit Luminous Auth Vault */}
        <main className="mx-auto w-full max-w-[455px] lg:col-span-5 lg:max-w-none">
          <div className="auth-vault-wrap">
            <div className="auth-card">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-wheat to-seashell px-3 py-1 text-[10px] font-extrabold tracking-[0.2em] text-violet border border-white">
                <FourPointStar className="h-2.5 w-2.5 text-french" />
                <span>{eyebrow}</span>
              </div>

              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-violet">
                {title}
              </h2>

              <p className="mt-1 mb-5 text-sm font-medium leading-relaxed text-french">
                {subtitle}
              </p>

              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-[1220px] flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-bold tracking-[0.16em] text-violet/75">
        <span>SHARE MORE · WASTE LESS · MADE FOR IMPACT</span>
        <span>© {new Date().getFullYear()} ERR</span>
      </footer>
    </div>
  );
}
