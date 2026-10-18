import { Link } from 'react-router-dom'
import { sectionIntro } from '../content/trustees'
import { TrusteeSpotlight } from '../components/TrusteeSpotlight'

export function AboutPage() {
  return (
    <main className="section-shell py-16 md:py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">About the Trust</p>
      <h1 className="mt-3 max-w-4xl font-display text-2xl leading-tight md:text-4xl">A South African trust focused on mobility, dignity, and inclusion for children born without limbs.</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <p className="text-xl leading-relaxed text-ink/80">Mpho Madi Trust Fund exists to reduce barriers between urgent need and practical support. We work with families, clinicians, and partners to improve access to prosthetics, wheelchairs, assistive devices, and follow-up support that helps children participate in everyday life.</p>
        <p className="text-xl leading-relaxed text-ink/80">Our approach combines financial support pathways with case guidance, family communication, and progress-based follow-up. We are building a transparent model where each contribution is linked to real outcomes and accountable reporting.</p>
      </div>
      <div className="mt-12 soft-divider" />

      {/* Teaser only — the full timeline lives on the Mpho's Story page so this
          page stays focused on the organisation itself. */}
      <section aria-labelledby="story-teaser" className="mt-12 rounded-[2rem] bg-[#fcf8f6] p-8 md:p-10">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">Her story</p>
        <h2 id="story-teaser" className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-4xl">
          The Trust began with one family&apos;s experience of the gap it now works to close.
        </h2>
        {/* TODO(client): replace with approved summary copy once the timeline milestones are confirmed. */}
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">
          Mpho&apos;s journey — the barriers met, the support that made a difference, and the people who
          stepped in along the way — is what shaped how this Trust works today. The full timeline traces
          that path from the Trust&apos;s founding through to its work now.
        </p>
        <Link
          to="/her-story"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-orchid/40 bg-white px-6 py-3 text-base font-semibold transition hover:border-brand-rose hover:text-brand-rose"
        >
          Read Mpho&apos;s Full Story <span aria-hidden="true">→</span>
        </Link>
      </section>

      <div className="mt-12 soft-divider" />

      <section aria-labelledby="board-of-trustees" className="mt-12">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">{sectionIntro.eyebrow}</p>
        <h2 id="board-of-trustees" className="mt-3 max-w-3xl font-display text-2xl leading-tight md:text-4xl">
          {sectionIntro.title}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sectionIntro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-ink/75">{paragraph}</p>
          ))}
        </div>
        <TrusteeSpotlight />
      </section>

      <div className="mt-12 soft-divider" />
      <div className="mt-12 flex flex-wrap gap-4">
        <Link to="/her-story" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">Read Mpho's Story</Link>
        {/* Archived 2026-07-21 — this was 'Apply for Support' -> /apply.
            Swapped to Donate so the page keeps a primary CTA; revert to the
            apply link if public intake is reinstated. */}
        <Link to="/donate" className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Donate</Link>
      </div>
    </main>
  )
}
