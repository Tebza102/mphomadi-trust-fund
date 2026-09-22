import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { brandLogoPath } from '../siteContent'
import { HEART_SRC, claimArrival, hasSeenArrival } from './arrivalSession'
import './SiteWelcome.css'

/**
 * The site's arrival animation.
 *
 * Three moments, one component:
 *
 *   arrival - the visitor's first entry in a browser session, through any
 *             public route. Heart, three beats, colour ripples, full logo.
 *             ~5.35s.
 *   reduced - the same welcome for anyone who asks for less motion: a still
 *             logo, held and faded. ~1.2s, and deliberately not a flicker.
 *   pulse   - one heartbeat when someone already welcomed navigates back to
 *             the home page. ~1.0s, no ripples, no logo.
 *
 * It is a sibling of the routes, never a wrapper. The page the visitor asked
 * for mounts, fetches and renders underneath while this paints on top, so a
 * direct link to Mpho's story reveals Mpho's story - there is no redirect to
 * the home page and nothing waits on the animation to render.
 */

/** Ripple order is fixed: the South African flag reading red, yellow, green, blue. */
const RIPPLES = [
  { name: 'red', color: '#E42313', delay: 2050 },
  { name: 'yellow', color: '#FFB612', delay: 2450 },
  { name: 'green', color: '#00843D', delay: 2850 },
  { name: 'blue', color: '#0057B8', delay: 3250 },
]

/**
 * Hold is measured from the overlay appearing; the fade runs after it.
 *   arrival 4800 + 550 = 5.35s
 *   reduced  850 + 350 = 1.20s
 *   pulse    700 + 300 = 1.00s
 */
const TIMING = {
  arrival: { hold: 4800, fade: 550 },
  reduced: { hold: 850, fade: 350 },
  pulse: { hold: 700, fade: 300 },
}

/**
 * Hard stop, comfortably clear of the 5.35s arrival so it can never cut the
 * sequence short - it exists only for the case where a timer is throttled or
 * an animation event never lands. No route can be left covered.
 */
const WATCHDOG = 7000

/** The portal is staff-facing and keeps its own behaviour - no brand intro over it. */
const isInternalRoute = (pathname) => pathname.startsWith('/portal') || pathname.startsWith('/admin')

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export function SiteWelcome() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const pathname = location.pathname
  const locationKey = location.key

  // Read once for this page load, so the decision stays out of the effects.
  const [reduced] = useState(prefersReducedMotion)

  /**
   * The arrival decision is made HERE, in the first render, rather than in an
   * effect.
   *
   * An effect runs after the browser has already been given a frame to paint,
   * so deciding there means the requested page is painted first and the
   * overlay drops on top of it a beat later - which is exactly the flash this
   * is meant not to have. Deciding during render puts the overlay in React's
   * very first commit, so the first frame the visitor sees is the white
   * introduction, never the site behind it.
   *
   * claimArrival() touches sessionStorage during render, which is a side
   * effect; it is safe here because the claim is memoised per page load, so
   * StrictMode's double render produces one answer and one write.
   */
  const [initial] = useState(() => {
    // Staff routes are left undecided rather than declined, so a visitor who
    // lands on the portal first still gets the welcome on their first public
    // page.
    if (isInternalRoute(pathname)) return { mode: null, pending: null }
    if (!claimArrival()) return { mode: null, pending: false }
    return { mode: reduced ? 'reduced' : 'arrival', pending: false }
  })

  const [mode, setMode] = useState(initial.mode)
  const [closing, setClosing] = useState(false)
  const skipRef = useRef(null)
  const restoreFocusRef = useRef(null)
  // The history entry this component has already reacted to. A StrictMode
  // double-invoke, a re-render or a redirect cannot replay one navigation.
  const handledKeyRef = useRef(initial.pending === null ? null : locationKey)
  // null = still undecided for this page load; true/false = the decision.
  const arrivalRef = useRef(initial.pending)
  // Which navigation the pulse decision belongs to, and what it was.
  const pulseRef = useRef({ key: null, play: false })

  // ---------------------------------------------------------------- arrival
  //
  // Only reached when the first route of the page load was a staff route and
  // the visitor has since moved to a public one. The common case is settled in
  // the first render above.
  //
  // Like the pulse effect below, this separates deciding from playing and
  // keeps the decision in a ref: an effect that decided and consumed in one
  // pass would answer "yes", have its timer cancelled by StrictMode's
  // teardown, then answer "no" on the re-run, so nothing would ever play in
  // development.
  useEffect(() => {
    if (mode !== null) return undefined

    if (arrivalRef.current === null) {
      if (isInternalRoute(pathname)) return undefined
      arrivalRef.current = claimArrival()
      handledKeyRef.current = locationKey
    }

    if (!arrivalRef.current) return undefined

    const start = window.setTimeout(() => {
      arrivalRef.current = false
      setMode(reduced ? 'reduced' : 'arrival')
    }, 0)
    return () => window.clearTimeout(start)
  }, [mode, pathname, locationKey, reduced])

  // ------------------------------------------------------------------ pulse
  useEffect(() => {
    // Nothing handled yet means this page load has not settled on a first
    // route; the first location is an arrival, never a navigation.
    if (handledKeyRef.current === null) return undefined

    if (pulseRef.current.key !== locationKey) {
      pulseRef.current = {
        key: locationKey,
        play:
          handledKeyRef.current !== locationKey &&
          !reduced &&
          pathname === '/' &&
          hasSeenArrival() &&
          // REPLACE is how this app redirects (/apply, the catch-all, the old
          // /preview tree). Those are corrections, not someone choosing to go
          // home, so they must not beat. A clicked link is PUSH, back is POP.
          navigationType !== 'REPLACE',
      }
      handledKeyRef.current = locationKey
    }

    if (!pulseRef.current.play) return undefined
    if (mode !== null) return undefined

    const start = window.setTimeout(() => {
      pulseRef.current = { key: locationKey, play: false }
      setMode('pulse')
    }, 0)
    return () => window.clearTimeout(start)
  }, [mode, pathname, locationKey, navigationType, reduced])

  /** Begin the fade out. */
  const finish = useCallback(() => setClosing(true), [])

  /** Retire the overlay and reset for the next time it is needed. */
  const close = useCallback(() => {
    setMode(null)
    setClosing(false)
  }, [])

  // ------------------------------------------------------- timers and input
  useEffect(() => {
    if (mode === null || closing) return undefined

    const timing = TIMING[mode]
    const timers = [window.setTimeout(finish, timing.hold), window.setTimeout(close, WATCHDOG)]

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    // Only the full sequence takes focus: it is long enough to need a Skip
    // control, and it is the one moment the visitor did not navigate for. The
    // one-second pulse sits between two pages the visitor asked for, so
    // stealing focus there would fight the keyboard user rather than help.
    if (mode === 'arrival') {
      restoreFocusRef.current = document.activeElement
      skipRef.current?.focus()
    }

    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mode, closing, finish, close])

  // Retire the node if the fade's animationend never arrives.
  useEffect(() => {
    if (!closing) return undefined
    const fade = TIMING[mode]?.fade ?? TIMING.arrival.fade
    const timer = window.setTimeout(close, fade + 80)
    return () => window.clearTimeout(timer)
  }, [closing, mode, close])

  // Hand focus back where it was, once the overlay is gone.
  useEffect(() => {
    if (mode !== null) return
    const previous = restoreFocusRef.current
    restoreFocusRef.current = null
    if (previous && typeof previous.focus === 'function' && document.contains(previous)) {
      previous.focus()
    }
  }, [mode])

  if (mode === null) return null

  const timing = TIMING[mode]
  const isArrival = mode === 'arrival'

  return (
    <div
      className={`mm-welcome mm-welcome--${mode}${closing ? ' is-closing' : ''}`}
      style={{ '--mm-fade': `${timing.fade}ms`, '--mm-heart-mask': `url(${HEART_SRC})` }}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) close()
      }}
    >
      {/* Decorative. Assistive technology is not made to sit through a
          commentary on beats and ripples. */}
      <div className="mm-welcome__stage" aria-hidden="true">
        {isArrival
          ? RIPPLES.map((ripple) => (
              <span
                key={ripple.name}
                className="mm-welcome__ripple"
                style={{ '--mm-ripple-color': ripple.color, '--mm-ripple-delay': `${ripple.delay}ms` }}
              />
            ))
          : null}

        {mode !== 'reduced' ? (
          <div className="mm-welcome__heart">
            <img src={HEART_SRC} alt="" className="mm-welcome__heart-art" fetchPriority="high" />
            <span className="mm-welcome__heart-gloss" />
            <span className="mm-welcome__heart-depth" />
          </div>
        ) : null}

        {mode !== 'pulse' ? <img src={brandLogoPath} alt="" className="mm-welcome__logo" /> : null}
      </div>

      {isArrival ? (
        <button ref={skipRef} type="button" className="mm-welcome__skip" onClick={finish}>
          Skip
        </button>
      ) : null}
    </div>
  )
}
