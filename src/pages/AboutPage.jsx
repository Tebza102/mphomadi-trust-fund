import { Link } from 'react-router-dom'
import { sectionIntro } from '../content/trustees'
import { TrusteeSpotlight } from '../components/TrusteeSpotlight'

export function AboutPage() {
  return (
    <main className="section-shell pb-16 pt-8 md:pb-24 md:pt-14">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">About the Trust</p>
      <h1 className="mt-3 max-w-4xl font-display text-3xl leading-tight md:text-[2.75rem]">A South African trust focused on mobility, dignity, and inclusion for children born without limbs.</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <p className="text-xl leading-relaxed text-ink/80">Mpho Madi Trust Fund exists to reduce barriers between urgent need and practical support. We work with families, clinicians, and partners to improve access to prosthetics, wheelchairs, assistive devices, and follow-up support that helps children participate in everyday life.</p>
        <p className="text-xl leading-relaxed text-ink/80">Our approach combines financial support pathways with case guidance, family communication, and progress-based follow-up. We are building a transparent model where each contribution is linked to real outcomes and accountable reporting.</p>
      </div>
      <section aria-labelledby="purpose-heading" className="mt-12 border-t border-brand-orchid/20 pt-12">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Our purpose</p>
        <h2 id="purpose-heading" className="mt-3 max-w-3xl font-display text-2xl leading-tight md:text-4xl">Helping children live life to the fullest</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-display text-2xl text-brand-plum">Our vision</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink/80">To help children realise their dreams and have the opportunity to live life to the fullest, without boundaries.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-brand-plum">Our mission</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink/80">To support children from disadvantaged families who were born without limbs by mobilising resources for prosthetics, wheelchairs and appropriate assistive support, helping them participate in everyday life with dignity.</p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="font-display text-2xl text-brand-plum">Our objectives</h3>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink/80">The Trust&apos;s central objective is to support children from families facing severe financial hardship who have been born without limbs.</p>
          <ul className="mt-5 max-w-3xl list-disc space-y-3 pl-6 text-lg leading-relaxed text-ink/80 marker:text-brand-rose">
            <li>Raise funds and bring partners together to help children access suitable mobility and assistive devices.</li>
            <li>Help reduce the barriers that prevent children from attending school and taking part in family and community life.</li>
            <li>Extend the support inspired by Mpho&apos;s journey to other children from disadvantaged families.</li>
          </ul>
        </div>
      </section>


      {/* Teaser only — the full timeline lives on the Mpho's Story page so this
          page stays focused on the organisation itself. */}
      <section aria-labelledby="story-teaser" className="mt-12 rounded-[2rem] bg-[#fcf8f6] p-8 md:p-10">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">Her story</p>
        <h2 id="story-teaser" className="mt-3 max-w-3xl font-display text-2xl leading-tight md:text-4xl">
          The Trust began with one family&apos;s experience of the gap it now works to close.
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">
          Mpho was born in Durban in 2000 without upper and lower limbs. Her mother, Mpumi,
          recalls a confident child whose enthusiasm for life shone through from an early age.
          When the family returned to Kwa-Thema in 2006, finding a school that could accommodate
          Mpho and nurture her potential proved difficult. Their experience showed how a child&apos;s
          opportunities can be restricted by barriers to access.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/75">
          Fundraising and donor support helped pay for Mpho&apos;s first artificial limbs.
          She received her lower limbs on 4 November 2008. Her journey helped shape the Trust&apos;s
          wider purpose: to offer support to other children from disadvantaged families who
          were born without limbs.
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
