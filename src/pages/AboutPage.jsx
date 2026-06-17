import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <main className="section-shell py-16 md:py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">About the Trust</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-6xl">A South African trust focused on mobility, dignity, and inclusion for children born without limbs.</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <p className="text-xl leading-relaxed text-ink/80">Mpho Madi Trust Fund exists to reduce barriers between urgent need and practical support. We work with families, clinicians, and partners to improve access to prosthetics, wheelchairs, assistive devices, and follow-up support that helps children participate in everyday life.</p>
        <p className="text-xl leading-relaxed text-ink/80">Our approach combines financial support pathways with case guidance, family communication, and progress-based follow-up. We are building a transparent model where each contribution is linked to real outcomes and accountable reporting.</p>
      </div>
      <div className="mt-12 soft-divider" />
      <div className="mt-12 flex flex-wrap gap-4">
        <Link to="/her-story" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">Read Mpho's Story</Link>
        <Link to="/apply" className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Apply for Support</Link>
      </div>
    </main>
  )
}
