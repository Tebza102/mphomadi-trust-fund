import { useCallback, useEffect, useState } from 'react'

// Discreet up/down controls for a genuinely scrollable panel. They complement
// native scrolling (wheel, touch, keyboard) and never replace it.
//
//   const { state, update, scrollPage } = useScrollNav(scrollerRef, isMounted)
//   <ScrollNav state={state} onScroll={scrollPage} label="biography" />   (components/ScrollNav.jsx)
//
// The scroller also gets `data-nav="on|off"` so CSS can reserve gutter space
// for the buttons only when they are showing (see `.spotlight-scroller`).
// Call `update()` yourself right after the scroller becomes visible if you need
// the measurement before the next frame (hidden elements measure as 0).

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function useScrollNav(ref, enabled) {
  const [state, setState] = useState({ overflow: false, atStart: true, atEnd: true })

  const update = useCallback(() => {
    const element = ref.current
    if (!element) return
    const overflow = element.scrollHeight - element.clientHeight > 1
    const atStart = element.scrollTop <= 1
    const atEnd = element.scrollTop + element.clientHeight >= element.scrollHeight - 1
    element.dataset.nav = overflow ? 'on' : 'off'
    setState((previous) =>
      previous.overflow === overflow && previous.atStart === atStart && previous.atEnd === atEnd
        ? previous
        : { overflow, atStart, atEnd },
    )
  }, [ref])

  useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return undefined

    const frame = requestAnimationFrame(update)
    element.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(element)
    if (element.firstElementChild) observer?.observe(element.firstElementChild)
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('scroll', update)
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref, enabled, update])

  // direction: -1 up, 1 down. Moves ~75% of the visible height; the browser
  // clamps at the ends. Immediate (not smooth) under reduced motion.
  const scrollPage = useCallback(
    (direction) => {
      const element = ref.current
      if (!element) return
      element.scrollBy({
        top: direction * element.clientHeight * 0.75,
        behavior: reducedMotion() ? 'auto' : 'smooth',
      })
    },
    [ref],
  )

  return { state, update, scrollPage }
}
