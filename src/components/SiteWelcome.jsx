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
 *             public route. Heart, three slow beats, colour ripples opening
 *             out, full logo. ~7.4s.
 *   reduced - the same welcome for anyone who asks for less motion: the still
 *             logo, shown at once and held. ~1.75s, no movement at all.
 *   pulse   - one heartbeat when someone already welcomed navigates back to
 *             the home page. ~1.0s, no ripples, no logo.
 *
 * It is a sibling of the routes, never a wrapper. The page the visitor asked
 * for mounts, fetches and renders underneath while this paints on top, so a
 * direct link to Mpho's story reveals Mpho's story - there is no redirect to
 * the home page and nothing waits on the animation to render.
 */

/**
 * Ripple order is fixed: the South African flag reading red, yellow, green,
 * blue. They start 450ms apart, once the third heartbeat has recovered, so the
 * colour opening never competes with the beats it grows out of.
 */
const RIPPLES = [
  { name: 'red', color: '#E42313', delay: 3650 },
  { name: 'yellow', color: '#FFB612', delay: 4100 },
  { name: 'green', color: '#00843D', delay: 4550 },
  { name: 'blue', color: '#0057B8', delay: 5000 },
]

/**
 * Hold is measured from the overlay appearing; the fade runs after it.
 *   arrival 6700 + 700 = 7.40s
 *   reduced 1200 + 550 = 1.75s
 *   pulse    700 + 300 = 1.00s
 */
const TIMING = {
  arrival: { hold: 6700, fade: 700 },
  reduced: { hold: 1200, fade: 550 },
  pulse: { hold: 700, fade: 300 },
}

/**
 * Hard stop, comfortably clear of the 7.4s arrival so it can never cut the
 * sequence short - it exists only for the case where a timer is throttled or
 * an animation event never lands. No route can be left covered.
 */
const WATCHDOG = 9000

/** The portal is staff-facing and keeps its own behaviour - no brand intro over it. */
const isInternalRoute = (pathname) => pathname.startsWith('/portal') || pathname.startsWith('/admin')

/**
 * Preview-only review switch: ?previewIntro=full forces the full-motion
 * introduction for that one page load.
 *
 * It exists because a reviewer whose operating system asks for reduced motion
 * cannot otherwise see the animation they are signing off, and neither
 * Incognito nor a different browser bypasses an OS-level preference.
 *
 * Deliberately fenced in:
 *   - only on a *.vercel.app host, so the live domain ignores it entirely;
 *   - only for the load that carries the parameter - nothing is stored, and
 *     the visitor's motion preference is never written to or overridden
 *     beyond that single view;
 *   - the parameter is then stripped from the address bar, so a refresh or a
 *     shared link behaves like an ordinary visit.
 */
const PREVIEW_HOST_SUFFIX = '.vercel.app'
const PREVIEW_PARAM = 'previewIntro'

function isPreviewFullMotionRequest() {
  try {
    if (!window.location.hostname.endsWith(PREVIEW_HOST_SUFFIX)) return false
    return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === 'full'
  } catch {
    return false
  }
}

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
    if (isInternalRoute(pathname)) return { mode: null, pending: null, forced: false }

    const forced = isPreviewFullMotionRequest()
    // The flag is still claimed on a forced review so the rest of that session
    // behaves normally; only its answer is ignored.
    const unseen = claimArrival()

    if (forced) return { mode: 'arrival', pending: false, forced: true }
    if (!unseen) return { mode: null, pending: false, forced: false }
    return { mode: reduced ? 'reduced' : 'arrival', pending: false, forced: false }
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

  const forced = initial.forced

  // Take the review parameter out of the address bar once it has done its job.
  // Raw replaceState, not a router navigate: the router never hears about it,
  // so nothing remounts and nothing replays.
  useEffect(() => {
    if (!forced) return
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete(PREVIEW_PARAM)
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    } catch {
      /* Address bar left as-is; the animation is unaffected. */
    }
  }, [forced])

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
      className={`mm-welcome mm-welcome--${mode}${forced ? ' mm-welcome--forced' : ''}${
        closing ? ' is-closing' : ''
      }`}
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
