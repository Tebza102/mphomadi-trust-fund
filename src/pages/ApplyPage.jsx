import { Link } from 'react-router-dom'
import { trackCta } from '../siteContent'

export function ApplyPage() {
  return (
    <main className="section-shell py-16 md:py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Get Help</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-6xl">Apply for support for a child who needs mobility assistance.</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Before you apply</h2>
          <ul className="mt-4 space-y-3 text-xl text-ink/80">
            <li>Referral details for the child and guardian.</li>
            <li>Current support need (prosthetic, wheelchair, assistive device, or follow-up care).</li>
            <li>Any relevant clinical documentation if available.</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl">What happens next</h2>
          <ul className="mt-4 space-y-3 text-xl text-ink/80">
            <li>Initial screening and acknowledgement.</li>
            <li>Needs assessment and planning.</li>
            <li>Support pathway confirmation and follow-up updates.</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <a href="mailto:info@mphomaditrustfund.org.za?subject=Apply%20for%20Support" onClick={() => trackCta('apply_click')} className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Start Application by Email</a>
        <Link to="/preview/contact" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">Contact for Guidance</Link>
      </div>
    </main>
  )
}
