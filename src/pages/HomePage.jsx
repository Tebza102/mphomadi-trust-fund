import { Link } from 'react-router-dom'
import { Picture } from '../components/Picture'
import { trackCta } from '../siteContent'
import { homepageContent } from './homeContent'
import { useSEO } from '../hooks/useSEO.jsx'

export function HomePage() {
  const { hero, founderStory, challenge, journey, waysToHelp } = homepageContent

  return (
    <main>
      {useSEO({
        title: 'Mpho Madi Trust Fund | Supporting Children Born Without Limbs',
        description:
          'Mobility devices, dignity-centred care and family guidance for children born without limbs. Donate or become a corporate sponsor.',
        ogUrl: 'https://mphomadi-trust-fund.vercel.app/',
      })}
      <section className="section-shell grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="space-y-6 md:col-span-6">
          <div className="space-y-1">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-brand-rose md:text-3xl">
              Mphomadi Trust Fund
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-plum/80 md:text-base">
              South Africa
            </p>
          </div>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-6xl">{hero.title}</h1>
          <p className="max-w-xl text-xl leading-relaxed text-ink/80">{hero.mission}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/preview/donate" onClick={() => trackCta('donate_click')} className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">
              Donate Now
            </Link>
            <Link to="/preview/donate#sponsor-pathway" onClick={() => trackCta('sponsor_click')} className="rounded-full border border-brand-orchid/40 bg-white px-6 py-3 text-base font-semibold text-ink hover:border-brand-orchid">
              Become a Sponsor
            </Link>
          </div>
        </div>
        <Picture
          name="02_award_moment_group"
          alt="Mpho Madi Trust Fund supporters and family members gathered outdoors with two young children, one seated in a wheelchair"
          className="h-[340px] w-full rounded-[2.5rem] md:col-span-6 md:h-[460px]"
          focus="object-center"
          loading="eager"
        />
      </section>

      <div className="soft-divider section-shell" />

      <section className="section-shell grid items-center gap-10 py-16 md:grid-cols-12">
        <Picture
          name="01_hero_portrait_speaking"
          alt="Mpho Madi speaking at a microphone during an Ekurhuleni Metropolitan Municipality event"
          className="h-[420px] w-full rounded-[2rem] md:col-span-5"
          focus="object-[60%_35%]"
        />
        <div className="space-y-5 md:col-span-7 md:pl-6">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">Founder Origin Story</p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">{founderStory.title}</h2>
          <p className="text-xl leading-relaxed text-ink/80">{founderStory.copy}</p>
        </div>
      </section>

      <section id="how-we-help" className="brand-stripe py-16 md:py-20">
        <div className="section-shell space-y-10">
          <h2 className="max-w-3xl font-display text-3xl leading-tight md:text-5xl">{challenge.title}</h2>
          <div className="grid gap-6 text-xl leading-relaxed text-ink/80 md:grid-cols-2">
            {challenge.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ol className="space-y-6 border-l border-brand-orchid/25 pl-6">
            {journey.map((step, index) => (
              <li key={step} className="relative">
                <span className="absolute -left-[34px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-plum">{index + 1}</span>
                <p className="text-lg text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="space-y-5 md:col-span-5">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Ways to Help</p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">Choose how you want to support a child's mobility journey.</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/preview/donate" onClick={() => trackCta('donate_click')} className="donate-pulse inline-flex rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">
              Open Donation Journey
            </Link>
            <Link to="/preview/donate#donor-form" onClick={() => trackCta('support_enquiry_click')} className="inline-flex rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">
              Send Donation Enquiry
            </Link>
          </div>
        </div>
        <ul className="space-y-5 md:col-span-7 md:pl-8">
          {waysToHelp.map((pathway, index) => <li key={pathway} className="flex items-start gap-4 border-b border-ink/10 pb-5"><span className="font-display text-3xl text-brand-orchid">{String(index + 1).padStart(2, '0')}</span><p className="pt-1 text-xl text-ink/90">{pathway}</p></li>)}
        </ul>
      </section>
    </main>
  )
}
