import { Link } from 'react-router-dom'
import { Picture } from '../components/Picture'
import { trackCta } from '../siteContent'
import { homepageContent } from './homeContent'
import { useSEO } from '../hooks/useSEO.jsx'

/**
 * Reference implementation of the Mpho Madi global design system. The visual
 * decisions here (background sequence, button hierarchy, section rhythm,
 * eyebrow/heading pattern) are meant to be copied onto About, Her Story, Donate
 * and Contact, not reinvented per page.
 */
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

      {/* Hero — white ground, editorial H1, one primary + one secondary CTA. */}
      <section className="section-shell grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24">
        <div className="space-y-6 md:col-span-6">
          <p className="eyebrow">Mpho Madi Trust Fund · South Africa</p>
          <h1 className="font-display text-4xl leading-tight text-brand-navy md:text-6xl">{hero.title}</h1>
          <p className="max-w-xl text-xl leading-relaxed text-ink/80">{hero.mission}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/preview/donate" onClick={() => trackCta('donate_click')} className="donate-pulse btn-primary">
              Donate Now
            </Link>
            <Link to="/preview/donate#corporate-sponsorship" onClick={() => trackCta('sponsor_click')} className="btn-secondary">
              Become a Sponsor
            </Link>
          </div>
        </div>
        <Picture
          name="02_award_moment_group"
          alt="Mpho Madi Trust Fund supporters and family members gathered outdoors with two young children, one seated in a wheelchair"
          className="h-[340px] w-full rounded-brand-lg shadow-brand md:col-span-6 md:h-[460px]"
          focus="object-center"
          loading="eager"
        />
      </section>

      <div className="soft-divider section-shell" />

      {/* Founder origin story — restrained, teaser-weight. The full personal
          journey lives on Mpho's Story; this section only has to establish
          human origin and lived experience. */}
      <section className="section-shell grid items-center gap-10 py-16 md:grid-cols-12">
        <Picture
          name="01_hero_portrait_speaking"
          alt="Mpho Madi speaking at a microphone during an Ekurhuleni Metropolitan Municipality event"
          className="h-[420px] w-full rounded-brand-lg md:col-span-5"
          focus="object-[60%_35%]"
        />
        <div className="space-y-5 md:col-span-7 md:pl-6">
          <p className="eyebrow">Founder Origin Story</p>
          <h2 className="font-display text-3xl leading-tight text-brand-navy md:text-5xl">{founderStory.title}</h2>
          <p className="text-xl leading-relaxed text-ink/80">{founderStory.copy}</p>
          <Link to="/preview/her-story" className="btn-tertiary">
            Read the full story
          </Link>
        </div>
      </section>

      {/* How we help — the one branded-light section on the page, per the
          controlled background sequence. Numbered steps use a single visual
          pattern, reused wherever a step sequence appears on other pages. */}
      <section id="how-we-help" className="brand-stripe py-16 md:py-20">
        <div className="section-shell space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="eyebrow">How We Help</p>
            <h2 className="font-display text-3xl leading-tight text-brand-navy md:text-5xl">{challenge.title}</h2>
          </div>
          <div className="grid gap-6 text-xl leading-relaxed text-ink/80 md:grid-cols-2">
            {challenge.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ol className="space-y-6 border-l border-brand-navy/15 pl-6">
            {journey.map((step, index) => (
              <li key={step} className="relative">
                <span className="absolute -left-[34px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-navy shadow-brand-sm">
                  {index + 1}
                </span>
                <p className="text-lg text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ways to help — white ground. Donate stays the obvious primary action;
          the enquiry link is secondary weight, not a competing equal. */}
      <section className="section-shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="space-y-5 md:col-span-5">
          <p className="eyebrow">Ways to Help</p>
          <h2 className="font-display text-3xl leading-tight text-brand-navy md:text-5xl">
            Choose how you want to support a child&apos;s mobility journey.
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/preview/donate" onClick={() => trackCta('donate_click')} className="donate-pulse btn-primary">
              Open Donation Journey
            </Link>
            <Link to="/preview/donate#enquiry-form" onClick={() => trackCta('support_enquiry_click')} className="btn-tertiary">
              Send Donation Enquiry
            </Link>
          </div>
        </div>
        <ul className="space-y-5 md:col-span-7 md:pl-8">
          {waysToHelp.map((pathway, index) => (
            <li key={pathway} className="flex items-start gap-4 border-b border-ink/10 pb-5">
              <span className="font-display text-3xl text-brand-green">{String(index + 1).padStart(2, '0')}</span>
              <p className="pt-1 text-xl text-ink/90">{pathway}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
