
const audiences = [
  ['01', 'Donors', 'Give usable items a second life by sharing what you no longer need.'],
  ['02', 'Beneficiaries', 'Find useful resources and connect with people ready to help.'],
  ['03', 'Administrators', 'Keep resources, accounts and redistribution organised.'],
];

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-layout min-h-screen">
      <aside className="auth-visual relative hidden overflow-hidden lg:flex">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          {/* Brand */}
          <div>
            <div className="auth-brand-mark">✦</div>

            <div className="mt-3 text-sm font-bold tracking-[0.28em] text-wheat">
              ERR
            </div>

            <div className="mt-1 text-xs tracking-[0.16em] text-seashell/80">
              ESSENTIAL RESOURCE REDISTRIBUTION
            </div>
          </div>

          {/* Main introduction */}
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold tracking-[0.25em] text-wheat">
              A COMMUNITY THAT SHARES
            </p>

            <h1 className="font-display text-5xl font-bold leading-[1.08] text-seashell xl:text-6xl">
              Good things deserve a{' '}
              <span className="text-wheat">second life.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-powder">
              Connecting people who have extra resources with those who need
              them. Less waste, more possibilities.
            </p>

            <div className="mt-12 space-y-5">
              {audiences.map(([number, term, text]) => (
                <div
                  key={term}
                  className="flex items-start gap-4 border-t border-white/20 pt-4"
                >
                  <span className="text-xs font-bold text-wheat">
                    {number}
                  </span>

                  <div>
                    <h3 className="font-semibold text-seashell">
                      {term}
                    </h3>

                    <p className="mt-1 max-w-sm text-sm leading-6 text-powder">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="text-xs tracking-[0.18em] text-white/60">
            SHARE MORE. WASTE LESS. · MADE FOR IMPACT.
          </p>
        </div>
      </aside>

      {/* Authentication section */}
      <main className="auth-main flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="auth-brand-mark small">✦</div>

            <div>
              <div className="font-display text-xl font-bold text-violet">
                ERR
              </div>

              <div className="text-[10px] font-bold tracking-[0.15em] text-blue">
                ESSENTIAL RESOURCE REDISTRIBUTION
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="auth-form-card">
            <div className="mb-2 text-xs font-bold tracking-[0.22em] text-french">
              WELCOME
            </div>

            <h2 className="font-display text-3xl font-bold leading-tight text-violet">
              {title}
            </h2>

            <p className="mt-2 mb-7 text-sm leading-6 text-blue">
              {subtitle}
            </p>

            {children}
          </div>

          {/* Footer */}
          <footer className="mt-7 flex flex-wrap justify-between gap-2 text-[10px] font-semibold tracking-[0.12em] text-blue/70">
  <span>ESSENTIAL RESOURCE REDISTRIBUTION</span>
  <span>© {new Date().getFullYear()} ERR</span>
</footer>
        </div>
      </main>
    </div>
  );
}
