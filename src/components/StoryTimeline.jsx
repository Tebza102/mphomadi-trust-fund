import { Picture } from './Picture'
import { Reveal } from './Reveal'
import { storyTimeline } from '../content/storyTimeline'

/**
 * Vertical narrative rail for the approved outcome model
 * (Mobility -> Participation -> Dignity -> Opportunity).
 *
 * Mobile: single rail down the left, image stacked above its text.
 * Desktop (md+): rail down the centre, image and text alternating sides so the
 * eye zig-zags down the page.
 *
 * Semantics: an ordered list, since the nodes are a deliberate progression. The
 * section is headed h2 by the caller and each node is h3 — no heading-shaped
 * divs. Nodes carry no dates: see the note in content/storyTimeline.js.
 */
export function StoryTimeline() {
  return (
    <ol className="relative mt-12 space-y-14 md:space-y-20">
      {/* The rail. Decorative, so hidden from assistive tech. */}
      <span
        aria-hidden="true"
        // -translate-x-1/2 at both breakpoints so the 1px rail sits on the dot centres.
        className="absolute bottom-2 left-[7px] top-2 w-px -translate-x-1/2 bg-gradient-to-b from-brand-orchid/10 via-brand-orchid/35 to-brand-orchid/10 md:left-1/2"
      />

      {storyTimeline.map((node, index) => {
        // Even nodes put the image right of the rail, odd nodes left of it.
        const imageRight = index % 2 === 0

        return (
          <li key={node.id} className="relative pl-9 md:pl-0">
            {/* Node marker, pinned to the rail at both breakpoints. */}
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-brand-rose bg-white md:left-1/2"
            />

            <Reveal className="md:grid md:grid-cols-2 md:items-center md:gap-14">
              {node.image ? (
                <Picture
                  name={node.image}
                  alt={node.imageAlt}
                  // Portrait sources need a focal point or the 4:3 box crops through faces.
                  focus={node.imageFocus ?? 'object-center'}
                  className={`mb-5 aspect-[4/3] w-full rounded-[1.5rem] md:mb-0 ${
                    imageRight ? 'md:order-2' : 'md:order-1'
                  }`}
                />
              ) : null}

              <div
                className={
                  imageRight ? 'md:order-1 md:pr-2 md:text-right' : 'md:order-2 md:pl-2 md:text-left'
                }
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-rose">{node.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-ink md:text-3xl">{node.heading}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink/75">{node.body}</p>
              </div>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
