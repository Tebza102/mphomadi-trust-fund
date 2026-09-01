import { Link } from 'react-router-dom'
import { trackCta } from '../siteContent'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white" aria-labelledby="final-cta-title">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e42313_0%,#ffb612_22%,#00843d_48%,#0057b8_76%,#111111_100%)]" aria-hidden="true" />
      <div className="section-shell grid gap-8 py-14 md:grid-cols-12 md:items-center md:py-20">
        <div className="space-y-4 md:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold md:text-base">Mobility • Dignity • Opportunity</p>
          <h2 id="final-cta-title" className="max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            Support a child&apos;s mobility journey.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/[0.78] md:text-xl">
            Give, sponsor, or start a conversation about practical support that helps children participate more fully in everyday life.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
          <Link
            to="/preview/donate#enquiry-form"
            onClick={() => trackCta('final_cta_donate_click')}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-red px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy"
          >
            Donate Now
          </Link>
          <Link
            to="/preview/donate#corporate-sponsorship"
            onClick={() => trackCta('final_cta_sponsor_click')}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.35] bg-transparent px-6 py-3 text-base font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </section>
  )
}
