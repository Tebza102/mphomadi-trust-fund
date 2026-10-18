import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brandLogoAlt, brandLogoHeaderPath, brandLogoHeaderSizes, brandLogoHeaderSrcSet, siteNav, trackCta } from '../siteContent'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // The header is fixed, so a spacer holds its place in the flow. Its height
  // follows the bar (not the mobile menu, which still overlays the page) so
  // content is never hidden when enlarged text makes the bar taller.
  const headerRef = useRef(null)
  const barRef = useRef(null)
  const [barHeight, setBarHeight] = useState(null)
  useEffect(() => {
    const bar = barRef.current
    const header = headerRef.current
    if (!bar || !header || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => {
      setBarHeight(bar.offsetHeight + (header.offsetHeight - header.clientHeight))
    })
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])
  const isSectionLink = (href) => href.includes('#')
  const navItems = [...siteNav]

  const desktopNavClass = ({ isActive } = {}) =>
    `transition-colors hover:text-brand-green ${isActive ? 'text-brand-green' : 'text-brand-navy/80'}`

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-brand-navy/10 bg-white/95 backdrop-blur">
        {/* flex-wrap: when enlarged text makes Donate/Menu too wide to share
            the row, they drop below the logo instead of squeezing it. The
            logo's min width is in px because the image does not scale with
            text. */}
        <div ref={barRef} className="section-shell flex min-h-[72px] flex-wrap items-center justify-between gap-x-2 gap-y-2 py-2 md:min-h-[88px] md:gap-x-5">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-w-[128px] flex-1 items-center md:flex-initial"
            aria-label="Mpho Madi Trust Fund home"
          >
            <img
              src={brandLogoHeaderPath}
              srcSet={brandLogoHeaderSrcSet}
              sizes={brandLogoHeaderSizes}
              width="1595"
              height="507"
              alt={brandLogoAlt}
              className="h-auto w-full max-w-[176px] md:max-w-[164px] lg:max-w-[201px]"
            />
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

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0 md:gap-2">
            {/* Hidden 2026-09-08 at the Trust's request. Removed from the visible
                site only — /portal/login still resolves and RequireRole still
                redirects there, so staff reach the portal via the URL directly.
                Restore by uncommenting.
            <Link
              to="/portal/login"
              className="hidden min-h-11 items-center rounded-full border border-brand-navy/20 bg-white px-3 py-1.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-green hover:text-brand-green md:inline-flex md:px-5 md:py-2 md:text-base"
            >
              Team Login
            </Link>
            */}
            <Link
              to="/donate#enquiry-form"
              onClick={() => trackCta('donate_click')}
              className="donate-pulse inline-flex min-h-11 items-center rounded-full bg-brand-red px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-brand-navy md:px-4"
            >
              Donate
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex min-h-11 items-center rounded-full border border-brand-navy/15 bg-white px-3 py-1 text-sm font-medium text-brand-navy md:hidden"
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
              {/* Hidden 2026-09-08 — see the note on the desktop button above.
              <Link
                to="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex min-h-11 items-center rounded-lg border-t border-brand-navy/10 px-2 pt-4 text-base text-brand-navy/60 transition-colors hover:text-brand-green"
              >
                Team Login
              </Link>
              */}
            </nav>
          </div>
        )}
      </header>
      <div className="h-[72px] md:h-[88px]" style={barHeight ? { height: barHeight } : undefined} aria-hidden="true" />
    </>
  )
}
