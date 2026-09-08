import { Helmet } from 'react-helmet-async'
import { brandLogoAlt, brandLogoPath } from '../siteContent'
import { trustDetails } from '../content/trustDetails'

/**
 * Standby holding page.
 *
 * Not mounted. The public site took over `/` on 7 September 2026 — see the note
 * in routes/AppRoutes.jsx. This is kept ready for a planned outage or a future
 * rebuild, so it is maintained on the current brand system rather than left to
 * rot against the palette it was written for.
 *
 * To put it back on the root, add this above the public routes in AppRoutes:
 *   <Route path="/" element={<UnderConstructionPage />} />
 * The `noindex` below matters when it is live: a holding page that gets indexed
 * outranks the real site for the Trust's own name long after it comes down.
 */
export function UnderConstructionPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Helmet>
        <title>Mpho Madi Trust Fund | Website Update in Progress</title>
        <meta name="description" content="The Mpho Madi Trust Fund website is being updated. Contact the Trust directly in the meantime." />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="googlebot" content="noindex,nofollow,noarchive" />
      </Helmet>

      <div className="section-shell flex flex-1 flex-col items-center justify-center py-16 text-center md:py-24">
        {/* The mark carries this page — there is no navigation and no
            photography to establish who this is, so it leads at full size. */}
        <img
          src={brandLogoPath}
          alt={brandLogoAlt}
          className="h-28 w-auto md:h-40"
        />

        {/* The four flag colours of the mark, as on the letterhead. */}
        <div aria-hidden="true" className="mt-8 flex h-[3px] w-full max-w-xs overflow-hidden rounded-full">
          <i className="h-full w-[26%] bg-brand-red" />
          <i className="h-full w-[16%] bg-brand-gold" />
          <i className="h-full w-[32%] bg-brand-green" />
          <i className="h-full w-[26%] bg-brand-blue" />
        </div>

        <p className="eyebrow mt-10">Website update in progress</p>

        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-brand-navy md:text-6xl">
          We are improving the Mpho Madi Trust Fund website.
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/80">
          The Trust supports children born without limbs with prosthetics, wheelchairs,
          assistive devices, and family-centred guidance. That work continues while the
          site is being updated — please reach the team directly in the meantime.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`${trustDetails.emailHref}?subject=Contact%20Mpho%20Madi%20Trust%20Fund`}
            className="btn-primary"
          >
            Contact the Trust
          </a>
          <a
            href={`${trustDetails.emailHref}?subject=Sponsorship%20Enquiry`}
            className="btn-secondary"
          >
            Sponsorship Enquiry
          </a>
        </div>

        <p className="mt-12 flex flex-wrap items-center justify-center gap-x-2 text-base text-ink/75">
          <span className="font-semibold text-brand-navy">Email:</span>
          <a href={trustDetails.emailHref} className="hover:text-brand-navy">{trustDetails.email}</a>
        </p>
      </div>

      {/* Statutory identifiers, same as the institutional footer: a holding page
          is exactly where someone checks whether the organisation is real. */}
      <footer className="border-t border-border">
        <div className="section-shell py-6 text-center text-sm leading-relaxed text-ink/60">
          <p className="font-semibold text-brand-navy">Mpho Madi Trust Fund</p>
          <p className="mt-1">
            Trust Registration No. {trustDetails.registration} &nbsp;·&nbsp; NPO Registration No. {trustDetails.npo}
          </p>
          <p className="mt-1">{trustDetails.address}</p>
        </div>
      </footer>
    </main>
  )
}
