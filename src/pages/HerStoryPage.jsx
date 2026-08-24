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
          {/* 01_hero_portrait_speaking is the image the repo already identifies as
              Mpho. Do not swap in 03_fulllength_portrait here — that photograph is
              of a child, not of Mpho, and captioning it with her name would
              misidentify a real person. */}
          <Picture
            name="01_hero_portrait_speaking"
            alt="Mpho Madi speaking at a microphone during an Ekurhuleni Metropolitan Municipality event"
            className="h-[440px] w-full rounded-[2rem] md:col-span-5"
            focus="object-[60%_35%]"
          />
          <div className="space-y-6 text-xl leading-relaxed text-ink/80 md:col-span-7">
            <p>Mpho Madi Trust Fund is built on lived experience of the barriers it now works to remove. That perspective is why the Trust starts with the practical question — what does this child actually need to move — rather than with paperwork.</p>
            <p>The Trust understands mobility barriers from the inside: the cost of a device, the wait, the adjustments a growing child needs, and the difference it makes when someone helps a family through that process instead of leaving them to navigate it alone.</p>
            <p>That understanding shapes how support works today, and it is what the Trust asks donors, sponsors and partners to back.</p>
            <div className="flex flex-wrap gap-4 pt-3">
              <Link to="/preview/about" className="rounded-full border border-brand-orchid/40 px-6 py-3 text-base font-semibold hover:border-brand-orchid">About the Trust</Link>
              <Link to="/preview/donate" className="donate-pulse rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white hover:bg-brand-plum">Support the Mission</Link>
            </div>
          </div>
        </div>

        {/* Not headed "the story so far" / "our history": the nodes carry no
            verified dates, so the section must not imply a chronology. */}
        <section aria-labelledby="story-journey" className="mt-16 md:mt-24">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-sun">The journey</p>
          <h2 id="story-journey" className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            Mobility is where it starts, not where it ends
          </h2>
          <StoryTimeline />
        </section>
      </div>

      <StoryVideoAppeal />
    </main>
  )
}
