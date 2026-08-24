import { Link } from 'react-router-dom'
import { Picture } from '../components/Picture'
import { StoryTimeline } from '../components/StoryTimeline'
import { StoryVideoAppeal } from '../components/StoryVideoAppeal'

export function HerStoryPage() {
  return (
    // No bottom padding here — the appeal section is full-bleed and closes the page.
    <main className="pt-16 md:pt-24">
      <div className="section-shell">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Her Story</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-6xl">Mpho's journey is the reason this Trust exists.</h1>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-12">
          <Picture
            name="03_fulllength_portrait"
            alt="Mpho Madi, full-length portrait"
            className="h-[440px] w-full rounded-[2rem] md:col-span-5"
            focus="object-center"
          />
          <div className="space-y-6 text-xl leading-relaxed text-ink/80 md:col-span-7">
            <p>This page is intentionally included to mirror your required website structure and the live <strong>Her Story</strong> journey path. It frames the Trust through lived experience, resilience, and practical impact rather than pity-based messaging.</p>
            <p>The final narrative should be replaced with approved first-party wording from <a className="underline" href="https://www.mphomaditrustfund.org.za/Her-Story" target="_blank" rel="noreferrer">mphomaditrustfund.org.za/Her-Story</a>. Current copy is a respectful editorial placeholder so design and flow can be reviewed now.</p>
            <p><strong>TBD_VERIFIED story markers:</strong> early life context, key turning points, support barriers experienced, and the founding motivation behind this Trust.</p>
            <p>The objective of this page is to connect credibility and purpose: why the Trust understands mobility barriers deeply, and how that insight shapes the support journey for children and families today.</p>
            <div className="flex flex-wrap gap-4 pt-3">
              <Link to="/preview/about" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">About the Trust</Link>
              <Link to="/preview/donate" className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Support the Mission</Link>
            </div>
          </div>
        </div>

        <section aria-labelledby="story-timeline" className="mt-16 md:mt-24">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">The journey</p>
          <h2 id="story-timeline" className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            The story so far
          </h2>
          <StoryTimeline />
        </section>
      </div>

      <StoryVideoAppeal />
    </main>
  )
}
