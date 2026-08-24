import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brandLogoAlt, brandLogoPath, siteNav, trackCta } from '../siteContent'

export function SiteLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isSectionLink = (href) => href.includes('#')
  const navItems = [...siteNav]

  return (
    <div className="min-h-screen font-body text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="section-shell flex min-h-[72px] items-center justify-between gap-3 py-3 md:min-h-[88px] md:gap-6 md:py-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
            <img src={brandLogoPath} alt={brandLogoAlt} className="h-11 w-auto md:h-16" />
            <span className="sr-only">Mpho Madi Trust Fund</span>
          </Link>
          <nav className="hidden flex-wrap items-center gap-5 text-base md:flex">
            {navItems.map((item) =>
              isSectionLink(item.href) ? (
                <a key={item.label} href={item.href} className="text-ink/80 transition hover:text-brand-rose">
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `transition hover:text-brand-rose ${isActive ? 'text-brand-rose' : 'text-ink/80'}`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/preview/portal/login"
              className="hidden rounded-full border border-brand-orchid/40 px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-brand-rose hover:text-brand-rose md:inline-flex md:px-5 md:py-2 md:text-base"
            >
              Team Login
            </Link>
            <Link
              to="/preview/donate#enquiry-form"
              onClick={() => trackCta('donate_click')}
              className="donate-pulse inline-flex rounded-full bg-brand-rose px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-plum md:px-5 md:py-2 md:text-base"
            >
              Donate
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex items-center rounded-full border border-brand-orchid/40 px-3 py-1.5 text-sm font-semibold text-ink md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
            >
              Menu
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div id="mobile-nav" className="border-t border-ink/10 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) =>
                isSectionLink(item.href) ? (
                  <a
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-2 py-1 text-base text-ink/80 transition hover:text-brand-rose"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={`mobile-${item.label}`}
                    to={item.href}
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-2 py-1 text-base transition hover:text-brand-rose ${
                        isActive ? 'text-brand-rose' : 'text-ink/80'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
              <Link
                to="/preview/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex min-h-11 items-center rounded-lg border-t border-ink/10 px-2 pt-4 text-base text-ink/60 transition hover:text-brand-rose"
              >
                Team Login
              </Link>
            </nav>
          </div>
        )}
      </header>
      <div className="h-[72px] md:h-[88px]" aria-hidden="true" />
      {children}
    </div>
  )
}
