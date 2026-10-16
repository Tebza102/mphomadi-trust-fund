import { useEffect, useRef, useState } from 'react'
import { trustees } from '../content/trustees'

// Portrait Spotlight: trustee cards open a modal profile. The browser's native
// <dialog> supplies the focus trap, Escape handling, inert background and
// top-layer stacking; the motion is a FLIP-style flight of the existing
// photograph (a throwaway clone) from the card into the profile and back, plus
// short opacity/translate fades. No animation dependency.
//
// Content comes straight from src/content/trustees.js — nothing is duplicated.

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
  const photoRef = useRef(null)
  const scrollerRef = useRef(null)

  // 'idle' | 'opening' | 'open' | 'closing' — guards against rapid repeat clicks.
  const phase = useRef('idle')
  const running = useRef([])
  const cloneRef = useRef(null)

  const cardImage = (index) => cardRefs.current[index]?.querySelector('img') ?? null

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

    const clone = document.createElement('img')
    clone.src = toEl.currentSrc || toEl.src
    clone.alt = ''
    clone.setAttribute('aria-hidden', 'true')
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${to.top}px`,
      left: `${to.left}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      margin: '0',
      objectFit: 'cover',
      borderRadius: '1rem',
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
    const image = cardImage(index)
    if (image) image.style.visibility = 'hidden'
    setActive(index)
  }

  const closeProfile = async () => {
    if (phase.current === 'closing' || phase.current === 'idle' || active === null) return
    phase.current = 'closing'
    const index = active
    cancelRunning()

    if (!prefersReducedMotion()) {
      const photo = photoRef.current
      const card = cardImage(index)
      if (photo) photo.style.visibility = 'hidden'
      await Promise.all([
        photo && card ? flyPhoto(photo, card, { reverse: true }) : Promise.resolve(),
        fade(backdropRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS }),
        fade(panelRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS }),
        fade(textRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS * 0.7 }),
      ])
    }

    const card = cardImage(index)
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
    const unlock = lockScroll()
    const index = active
    const trigger = cardRefs.current[index]

    if (!prefersReducedMotion()) {
      const photo = photoRef.current
      const card = cardImage(index)
      const flight = photo && card ? flyPhoto(card, photo, { reverse: false }) : Promise.resolve()
      if (photo && cloneRef.current) photo.style.visibility = 'hidden'

      Promise.all([
        flight,
        fade(backdropRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: REVEAL_MS }),
        fade(panelRef.current, [{ opacity: 0, transform: 'translateY(14px) scale(0.985)' }, { opacity: 1, transform: 'none' }], { duration: FLIGHT_MS }),
        fade(textRef.current, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: REVEAL_MS, delay: 120 }),
      ]).then(() => {
        if (photoRef.current) photoRef.current.style.visibility = ''
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
      const card = cardImage(index)
      if (card) card.style.visibility = ''
      if (dialog.open) dialog.close()
      // Explicit, so focus returns to the trigger even where the browser's own
      // restore doesn't (e.g. Safari doesn't focus buttons on click).
      trigger?.focus({ preventScroll: true })
    }
  }, [active])

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
              className="group block h-full w-full cursor-pointer rounded-[1.5rem] border border-brand-orchid/15 bg-white p-4 text-center shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="block overflow-hidden rounded-[1rem] bg-[#f4f1f6]">
                <img
                  src={`/images/trustees/${person.image}.jpg`}
                  alt=""
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="mt-4 block font-display text-lg leading-tight text-ink">{person.name}</span>
              <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">{person.role}</span>
              <span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-rose group-hover:underline">
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
            <div className="relative flex h-full w-full flex-col sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-5xl">
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
                className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain sm:rounded-[1.75rem]"
              >
                <div className="flex flex-col gap-6 px-6 pb-10 pt-16 sm:px-10 sm:pt-14 lg:flex-row lg:gap-10 lg:p-10">
                  <div className="w-full max-w-[18rem] self-center sm:self-start lg:sticky lg:top-0 lg:w-[38%] lg:max-w-none lg:shrink-0 lg:self-start">
                    <div className="overflow-hidden rounded-[1rem] bg-[#f4f1f6]">
                      <img
                        ref={photoRef}
                        src={`/images/trustees/${trustee.image}.jpg`}
                        alt={`${trustee.name}, ${trustee.role}`}
                        width="600"
                        height="600"
                        decoding="async"
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  </div>
                  <div ref={textRef} className="min-w-0 flex-1">
                    <h3 id="trustee-profile-name" className="font-display text-3xl leading-tight md:text-4xl">
                      {trustee.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">{trustee.role}</p>
                    <div className="mt-6 max-w-prose space-y-4">
                      {trustee.bio.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-relaxed text-ink/80 md:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
