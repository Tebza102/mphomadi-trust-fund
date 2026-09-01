import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brandLogoAlt, brandLogoPath, siteNav, trackCta } from '../siteContent'

export function SiteLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isSectionLink = (href) => href.includes('#')
  const navItems = [...siteNav]

  const desktopNavClass = ({ isActive } = {}) =>
    `transition-colors hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-brand-navy/80'}`

  return (
    <div className="min-h-screen font-body text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-navy/10 bg-white/95 backdrop-blur">
        <div className="section-shell flex min-h-[72px] items-center justify-between gap-3 py-3 md:min-h-[88px] md:gap-6 md:py-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
            <img src={brandLogoPath} alt={brandLogoAlt} className="h-11 w-auto md:h-16" />
            <span className="sr-only">Mpho Madi Trust Fund</span>
          </Link>

          <nav className="hidden flex-wrap items-center gap-5 text-base md:flex" aria-label="Primary navigation">
            {navItems.map((item) =>
              isSectionLink(item.href) ? (
                <a key={item.label} href={item.href} className="text-brand-navy/80 transition-colors hover:text-brand-green">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.label} to={item.href} end className={desktopNavClass}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/preview/portal/login"
              className="hidden min-h-11 items-center rounded-full border border-brand-navy/20 bg-white px-3 py-1.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-green hover:text-brand-green md:inline-flex md:px-5 md:py-2 md:text-base"
            >
              Team Login
            </Link>
            <Link
              to="/preview/donate#enquiry-form"
              onClick={() => trackCta('donate_click')}
              className="donate-pulse inline-flex min-h-11 items-center rounded-full bg-brand-red px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy md:px-5 md:py-2 md:text-base"
            >
              Donate
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex min-h-11 items-center rounded-full border border-brand-navy/20 bg-white px-3 py-1.5 text-sm font-semibold text-brand-navy md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
            >
              Menu
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav" className="border-t border-brand-navy/10 bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {navItems.map((item) =>
                isSectionLink(item.href) ? (
                  <a
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-2 py-1 text-base text-brand-navy/80 transition-colors hover:text-brand-green"
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
                      `rounded-lg px-2 py-1 text-base transition-colors hover:text-brand-green ${
                        isActive ? 'text-brand-green' : 'text-brand-navy/80'
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
                className="mt-2 flex min-h-11 items-center rounded-lg border-t border-brand-navy/10 px-2 pt-4 text-base text-brand-navy/60 transition-colors hover:text-brand-green"
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
