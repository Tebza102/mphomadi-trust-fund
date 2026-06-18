import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7efe9_0%,#fffaf7_42%,#ffffff_100%)]">
      <Helmet>
        <title>Mpho Madi Trust Fund | Under Construction</title>
        <meta name="description" content="The Mpho Madi Trust Fund website is being improved." />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="googlebot" content="noindex,nofollow,noarchive" />
      </Helmet>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-plum/70">Mpho Madi Trust Fund</p>
          <span className="rounded-full border border-brand-orchid/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-plum/70">
            Website update in progress
          </span>
        </div>

        <section className="flex flex-1 items-center">
          <div className="grid w-full gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="space-y-7">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-rose">Public holding page</p>
              <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink md:text-6xl">
                Mpho Madi Trust Fund website is being improved.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-ink/75 md:text-xl">
                We are updating the website to better share our community work, sponsorship opportunities, programme updates, and impact stories.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:info@mphomaditrustfund.org.za?subject=Contact%20Mpho%20Madi%20Trust%20Fund"
                  className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-plum"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@mphomaditrustfund.org.za?subject=Sponsorship%20Enquiry"
                  className="rounded-full border border-brand-orchid/30 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-brand-rose hover:text-brand-rose"
                >
                  Sponsorship Enquiry
                </a>
              </div>
              <p className="max-w-xl text-sm leading-6 text-ink/60">
                Authorised users should use the private preview link provided by the development team.
              </p>
            </div>

            <div className="rounded-[2rem] border border-brand-orchid/15 bg-white/85 p-6 shadow-[0_30px_80px_-50px_rgba(47,22,71,0.35)] backdrop-blur">
              <div className="space-y-5 rounded-[1.5rem] bg-brand-plum px-6 py-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">What remains visible</p>
                <ul className="space-y-3 text-base leading-7 text-white/86">
                  <li>Community work highlights</li>
                  <li>Sponsorship and donor pathways</li>
                  <li>Programme and impact updates</li>
                  <li>Private preview access for the client team</li>
                </ul>
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-brand-orchid/25 bg-[#fcf8f6] px-5 py-4 text-sm leading-6 text-ink/70">
                This page is intentionally polished so the organisation still feels active and credible while the private preview is being refined.
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-sm text-ink/55">
          Private preview access is available at <Link className="underline decoration-brand-rose/40 underline-offset-4" to="/preview">/preview</Link>.
        </footer>
      </div>
    </main>
  )
}
