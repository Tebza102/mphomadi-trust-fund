import { Link } from 'react-router-dom'
import { trustDetails } from '../content/trustDetails'

export function ContactPage() {
  return (
    <main className="section-shell py-16 md:py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Contact</p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">Speak to Mpho Madi Trust Fund</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <dl className="space-y-5 text-lg text-ink/80">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">Email</dt>
              <dd className="mt-1">
                <a className="underline decoration-brand-rose/40 underline-offset-4 hover:text-brand-navy" href={trustDetails.emailHref}>
                  {trustDetails.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">Registered address</dt>
              <dd className="mt-1">
                <address className="not-italic leading-relaxed">
                  {trustDetails.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </dd>
            </div>
          </dl>

          {/* Statutory identifiers. Repeated in the institutional footer, which
              is the reference placement — this page is where people actually
              look for them, so both carry the full set. */}
          <div className="border-t border-ink/10 pt-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">Trust registration</h2>
            <dl className="mt-3 space-y-1.5 text-base text-ink/70">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink/90">Trust registration:</dt>
                <dd>{trustDetails.registration}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink/90">NPO:</dt>
                <dd>{trustDetails.npo}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-4 text-xl text-ink/80">
          <p>The Trust handles all enquiries by email. For donation questions and partnership conversations, write to the team directly and include your purpose in the subject line so your request is routed quickly.</p>
          <p className="text-lg text-ink/70">
            Verified banking details are shared directly with you after an enquiry, never published on this site.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/donate" className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Donate</Link>
            <Link to="/donate#enquiry-form" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">Send an Enquiry</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
