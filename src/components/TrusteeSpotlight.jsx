import { useEffect, useRef, useState } from 'react'
import { trustees } from '../content/trustees'
import { ScrollNav } from './ScrollNav'
import { useScrollNav } from '../hooks/useScrollNav'

// Portrait Spotlight: trustee cards open a modal profile. The browser's native
// <dialog> supplies the focus trap, Escape handling, inert background and
// top-layer stacking; the motion is a FLIP-style flight of the existing
// photograph (a throwaway clone) from the card into the profile and back, plus
// short opacity/translate fades. No animation dependency.
//
// Content comes straight from src/content/trustees.js — nothing is duplicated.
//
// Layout: the profile is one flowing column; the portrait floats left once the
// panel is wide enough (container query on the panel, not the viewport) so the
// name, role and opening paragraphs sit beside it and the rest flows beneath.
//
// Framing: every frame is 4:5, showing the approved 4:5 studio photograph
// (webp + jpg fallback) exactly as supplied.
const PORTRAIT_HOVER = 'group-hover:scale-[1.04] motion-reduce:group-hover:scale-100'

// The photograph for a card or profile frame. `hover` adds the card's zoom.
function TrusteePhoto({ person, alt, hover = false, loading }) {
  const motion = hover ? 'transition-transform duration-200 ease-out motion-reduce:transition-none' : ''
  const src = `/images/trustees/${person.portrait}`
  return (
    <picture className="block">
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width="800"
        height="1000"
        loading={loading}
        decoding="async"
        className={`aspect-[4/5] w-full object-cover object-center ${hover ? `${motion} ${PORTRAIT_HOVER}` : ''}`}
      />
    </picture>
  )
}

const EASE = 'cubic-bezier(0.22, 0.8, 0.24, 1)'
const FLIGHT_MS = 420
const REVEAL_MS = 320
const CLOSE_MS = 280

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// Page scroll lock that keeps the layout from jumping when the scrollbar goes.
function lockScroll() {
  const { body, documentElement } = document
  const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
  const gap = window.innerWidth - documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (gap > 0) body.style.paddingRight = `${gap}px`
  return () => {
    body.style.overflow = previous.overflow
    body.style.paddingRight = previous.paddingRight
  }
}

const inViewport = (rect) =>
  rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight

export function TrusteeSpotlight() {
  const [active, setActive] = useState(null)

  const cardRefs = useRef([])
  const dialogRef = useRef(null)
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const textRef = useRef(null)
  const frameRef = useRef(null)
  const scrollerRef = useRef(null)

  // 'idle' | 'opening' | 'open' | 'closing' — guards against rapid repeat clicks.
  const { state: scrollState, update: updateScrollNav, scrollPage } = useScrollNav(scrollerRef, active !== null)

  const phase = useRef('idle')
  const running = useRef([])
  const cloneRef = useRef(null)

  const cardFrame = (index) => cardRefs.current[index]?.querySelector('[data-frame]') ?? null

  const cancelRunning = () => {
    running.current.forEach((animation) => animation.cancel())
    running.current = []
    cloneRef.current?.remove()
    cloneRef.current = null
  }

  // Moves a clone of the photograph between two rectangles. Resolves when done.
  const flyPhoto = (fromEl, toEl, { reverse }) => {
    const dialog = dialogRef.current
    const from = fromEl.getBoundingClientRect()
    const to = toEl.getBoundingClientRect()
    if (!dialog || !inViewport(from) || !inViewport(to)) return Promise.resolve()

    // A deep clone of the frame keeps the zoom/crop classes, so the flight
    // lands on exactly what the profile shows.
    const clone = toEl.cloneNode(true)
    clone.removeAttribute('id')
    clone.setAttribute('aria-hidden', 'true')
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${to.top}px`,
      left: `${to.left}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      maxWidth: 'none',
      margin: '0',
      float: 'none',
      transformOrigin: 'top left',
      pointerEvents: 'none',
      zIndex: '2',
    })
    dialog.appendChild(clone)
    cloneRef.current = clone

    const offset = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`
    const frames = reverse ? [{ transform: 'none' }, { transform: offset }] : [{ transform: offset }, { transform: 'none' }]
    const animation = clone.animate(frames, { duration: FLIGHT_MS, easing: EASE, fill: 'forwards' })
    running.current.push(animation)
    return animation.finished.catch(() => {})
  }

  const fade = (element, keyframes, options) => {
    if (!element) return Promise.resolve()
    const animation = element.animate(keyframes, { easing: EASE, fill: 'both', ...options })
    running.current.push(animation)
    return animation.finished.catch(() => {})
  }

  const openProfile = (index) => {
    if (phase.current !== 'idle') return
    phase.current = 'opening'
    const frame = cardFrame(index)
    if (frame) frame.style.visibility = 'hidden'
    setActive(index)
  }

  const closeProfile = async () => {
    if (phase.current === 'closing' || phase.current === 'idle' || active === null) return
    phase.current = 'closing'
    const index = active
    cancelRunning()

    if (!prefersReducedMotion()) {
      const photo = frameRef.current
      const card = cardFrame(index)
      if (photo) photo.style.visibility = 'hidden'
      await Promise.all([
        photo && card ? flyPhoto(photo, card, { reverse: true }) : Promise.resolve(),
        fade(backdropRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS }),
        fade(panelRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS }),
        fade(textRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS * 0.7 }),
      ])
    }

    const card = cardFrame(index)
    if (card) card.style.visibility = ''
    phase.current = 'idle'
    setActive(null)
  }

  // Open: show the modal, lock scroll, play the entrance. Cleanup also covers
  // unmounting mid-animation (route change) so nothing is left hidden or locked.
  useEffect(() => {
    if (active === null) return undefined
    const dialog = dialogRef.current
    if (!dialog) return undefined

    if (!dialog.open) dialog.showModal()
    // Measure overflow first: it reserves the button gutter, which moves the
    // portrait's destination before the flight is measured.
    updateScrollNav()
    const unlock = lockScroll()
    const index = active
    const trigger = cardRefs.current[index]

    if (!prefersReducedMotion()) {
      const photo = frameRef.current
      const card = cardFrame(index)
      const flight = photo && card ? flyPhoto(card, photo, { reverse: false }) : Promise.resolve()
      if (photo && cloneRef.current) photo.style.visibility = 'hidden'

      Promise.all([
        flight,
        fade(backdropRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: REVEAL_MS }),
        fade(panelRef.current, [{ opacity: 0, transform: 'translateY(14px) scale(0.985)' }, { opacity: 1, transform: 'none' }], { duration: FLIGHT_MS }),
        fade(textRef.current, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: REVEAL_MS, delay: 120 }),
      ]).then(() => {
        if (frameRef.current) frameRef.current.style.visibility = ''
        cloneRef.current?.remove()
        cloneRef.current = null
        if (phase.current === 'opening') phase.current = 'open'
      })
    } else {
      phase.current = 'open'
    }

    return () => {
      cancelRunning()
      unlock()
      const card = cardFrame(index)
      if (card) card.style.visibility = ''
      if (dialog.open) dialog.close()
      // Explicit, so focus returns to the trigger even where the browser's own
      // restore doesn't (e.g. Safari doesn't focus buttons on click).
      trigger?.focus({ preventScroll: true })
    }
  }, [active, updateScrollNav])

  // Keys that scroll a focused scroller natively do nothing when focus is on
  // the Close/arrow buttons (siblings of the scroller). Forward them so the
  // biography stays keyboard-scrollable from anywhere in the dialog.
  const forwardScrollKeys = (event) => {
    const scroller = scrollerRef.current
    if (!scroller || event.target === scroller || event.altKey || event.ctrlKey || event.metaKey) return
    const step = { ArrowDown: 48, ArrowUp: -48, PageDown: scroller.clientHeight * 0.9, PageUp: -scroller.clientHeight * 0.9 }[event.key]
    if (step !== undefined) scroller.scrollBy({ top: step })
    else if (event.key === 'Home') scroller.scrollTo({ top: 0 })
    else if (event.key === 'End') scroller.scrollTo({ top: scroller.scrollHeight })
    else return
    event.preventDefault()
  }

  const trustee = active === null ? null : trustees[active]

  return (
    <>
      {/* 1-up on mobile, 2-up at sm so cards stay comfortable, 4-up at lg. */}
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trustees.map((person, index) => (
          <li key={person.image}>
            <button
              type="button"
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              onClick={() => openProfile(index)}
              aria-haspopup="dialog"
              className="group flex h-full w-full flex-col cursor-pointer rounded-[1.5rem] border border-brand-orchid/15 bg-white p-4 text-center shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span data-frame className="block overflow-hidden rounded-[1rem] bg-[#f4f1f6]">
                <TrusteePhoto person={person} alt="" hover loading="lazy" />
              </span>
              {/* overflow-wrap: anywhere only takes effect when a single word is
                  wider than the card (e.g. tracked uppercase roles at 200% text
                  in the four-column grid); normal sizes are unchanged. */}
              <span className="mt-4 block font-display text-lg leading-tight text-ink [overflow-wrap:anywhere]">{person.name}</span>
              <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.16em] text-ink/60 [overflow-wrap:anywhere]">{person.role}</span>
              <span className="mt-4 inline-flex min-h-11 items-center gap-1 self-center text-sm font-semibold text-brand-rose group-hover:underline">
                View full profile <span aria-hidden="true">&rarr;</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {trustee && (
        <dialog
          ref={dialogRef}
          aria-labelledby="trustee-profile-name"
          onCancel={(event) => {
            event.preventDefault()
            closeProfile()
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-visible border-0 bg-transparent p-0 text-ink backdrop:bg-transparent"
        >
          <div
            className="relative flex h-full w-full items-stretch justify-center sm:items-center sm:p-6"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeProfile()
            }}
          >
            <div ref={backdropRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/55" />
            <div
              className="relative flex h-full w-full flex-col sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-[44rem]"
              onKeyDown={forwardScrollKeys}
            >
              <div
                ref={panelRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white shadow-2xl sm:rounded-[1.75rem]"
              />
              <button
                type="button"
                onClick={closeProfile}
                className="absolute right-3 top-3 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow ring-1 ring-ink/15 hover:bg-[#f4f1f6]"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
                Close<span className="sr-only"> profile for {trustee.name}</span>
              </button>

              <div
                ref={scrollerRef}
                tabIndex={0}
                className="spotlight-scroller relative min-h-0 flex-1 overflow-y-auto overscroll-contain sm:rounded-[1.75rem]"
              >
                <div className="spotlight-body flow-root px-6 pb-10 pt-16">
                  <div
                    ref={frameRef}
                    data-frame
                    className="spotlight-frame mx-auto mb-6 w-full max-w-[20rem] overflow-hidden rounded-[1rem] bg-[#f4f1f6] ring-1 ring-ink/10"
                  >
                    <TrusteePhoto person={trustee} alt={`${trustee.name}, ${trustee.role}`} />
                  </div>
                  <div ref={textRef}>
                    <h3 id="trustee-profile-name" className="font-display text-3xl leading-tight md:text-4xl">
                      {trustee.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">{trustee.role}</p>
                    <div className="mt-5 space-y-4">
                      {trustee.bio.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-relaxed text-ink/80">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <ScrollNav state={scrollState} onScroll={scrollPage} label="biography" />
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
