import { Link } from 'react-router-dom'
import { brandLogoAlt, brandLogoPath, siteNav } from '../siteContent'

const footerNav = siteNav.filter((item) => item.label !== 'Donate')

export function SiteFooter() {
  return (
    <footer className="bg-[#0b2145] text-white" aria-label="Mpho Madi Trust Fund footer">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-12 md:py-14">
        <div className="space-y-5 md:col-span-5">
          <Link to="/preview" className="inline-flex items-center rounded-xl bg-white p-3" aria-label="Mpho Madi Trust Fund home">
            <img src={brandLogoPath} alt={brandLogoAlt} className="h-16 w-auto" />
          </Link>
          <p className="max-w-md font-display text-2xl leading-snug text-white">
            Mobility, dignity and opportunity for children who need practical support.
          </p>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            A South African Trust working with families and partners to reduce barriers to mobility and participation.
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Explore</h2>
          <nav className="mt-5" aria-label="Footer navigation">
            <ul className="space-y-3 text-base text-white/[0.78]">
              {footerNav.map((item) => (
                <li key={`footer-${item.label}`}>
                  {item.href.includes('#') ? (
                    <a href={item.href} className="transition-colors hover:text-white">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.href} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-5 md:col-span-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Get involved</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/preview/donate#enquiry-form" className="inline-flex min-h-11 items-center rounded-full bg-brand-red px-5 py-2.5 font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy">
                Donate
              </Link>
              <Link to="/preview/donate#corporate-sponsorship" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 py-2.5 font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold">
                Sponsor
              </Link>
            </div>
          </div>
          <div className="border-t border-white/[0.12] pt-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Institutional access</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              <Link to="/preview/contact" className="transition-colors hover:text-white">Contact the Trust</Link>
              <Link to="/preview/portal/login" className="transition-colors hover:text-white">Team Login</Link>
            </div>
            {/* Trust registration number, NPO number and registered address should be added here only after the Trust confirms the official details. */}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-sm text-white/[0.58] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Mpho Madi Trust Fund. South Africa.</p>
          <p>Mobility • Dignity • Opportunity</p>
        </div>
      </div>
    </footer>
  )
}
