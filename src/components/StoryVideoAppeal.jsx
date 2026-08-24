import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { storyVideo } from '../content/storyTimeline'
import { trackCta } from '../siteContent'

/**
 * Closing section of the Mpho's Story timeline: the appeal.
 *
 * Deliberately full-bleed and dark so it reads as the moment to act rather than
 * as one more milestone on the rail. Exactly one call to action — resist adding
 * a second, competing button here.
 */
function Player() {
  const { ready, provider, src, poster, captions, title } = storyVideo

  if (!ready) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/25 bg-white/5 p-8 text-center"
        role="note"
      >
        <p className="max-w-md text-sm leading-6 text-white/70">
          Video pending — awaiting the final cut and its caption file from the Trust. The player and
          its captions track are wired up and will appear here once supplied.
        </p>
      </div>
    )
  }

  if (provider === 'youtube' || provider === 'vimeo') {
    const embed = provider === 'youtube' ? `https://www.youtube-nocookie.com/embed/${src}` : `https://player.vimeo.com/video/${src}`

    return (
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-[1.5rem] border-0"
      />
    )
  }

  return (
    // Captions are supplied via the <track> element below.
    <video
      controls
      preload="metadata"
      poster={poster}
      aria-label={title}
      className="aspect-video w-full rounded-[1.5rem] bg-black"
    >
      <source src={src} type="video/mp4" />
      <track kind="captions" src={captions} srcLang="en" label="English" default />
      Your browser does not support embedded video.{' '}
      <a href={src}>Download the video instead.</a>
    </video>
  )
}

export function StoryVideoAppeal() {
  return (
    <section aria-labelledby="story-appeal" className="mt-20 bg-brand-plum py-16 text-white md:mt-28 md:py-24">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">The invitation</p>
          <h2 id="story-appeal" className="mt-3 font-display text-3xl leading-tight md:text-5xl">
            {storyVideo.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80 md:text-xl">{storyVideo.standfirst}</p>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <Player />
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link
            to={storyVideo.cta.to}
            onClick={() => trackCta('story_appeal_cta')}
            className="inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-brand-plum transition hover:bg-brand-sun hover:text-ink"
          >
            {storyVideo.cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
