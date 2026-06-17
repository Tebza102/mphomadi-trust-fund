import { Link } from 'react-router-dom'

export function ContactPage() {
  return (
    <main className="section-shell py-16 md:py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Contact</p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">Speak to Mpho Madi Trust Fund</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-xl text-ink/80">
          <p>Email: <a className="underline" href="mailto:info@mphomaditrustfund.org.za">info@mphomaditrustfund.org.za</a></p>
          <p>Phone: <span className="font-semibold">TBD_VERIFIED</span></p>
          <p>Location: South Africa</p>
        </div>
        <div className="space-y-4 text-xl text-ink/80">
          <p>For donation questions, partnership conversations, and application guidance, contact the Trust directly. Include your purpose in the subject line so the team can route your request quickly.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/donate" className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Donate</Link>
            <Link to="/apply" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">Apply for Support</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
