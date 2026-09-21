import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { brandLogoPath } from '../siteContent'
import { WELCOME_HEART_SRC, claimWelcomeAnimation } from './welcomeAnimation'
import './PortalWelcome.css'

/**
 * The branded flourish that plays once after a team member signs in.
 *
 * Deliberately a sibling of the routes rather than a wrapper around them. The
 * dashboard mounts, fetches and renders exactly as it always has; this paints
 * on top of it for five seconds and then unmounts. It does not validate
 * credentials, read roles, hold the session or stand between the user and any
 * navigation — if every line of it threw, the portal would still open.
 *
 * Mounted once at app level rather than inside the portal routes: a component
 * inside RequireRole would remount on every move between /portal, a lead and
 * the team screen, and replay each time.
 */

/** Ripple order is fixed: the South African flag reading red, yellow, green, blue. */
const RIPPLES = [
  { name: 'red', color: '#E42313', delay: 700 },
  { name: 'yellow', color: '#FFB612', delay: 1050 },
  { name: 'green', color: '#00843D', delay: 1400 },
  { name: 'blue', color: '#0057B8', delay: 1750 },
]

/** Full sequence: 4.50s of animation + 0.45s fade = 4.95s. */
const FULL = { hold: 4500, fade: 450 }
/** Reduced motion: a brief logo fade and out, well inside the 300-400ms target. */
const REDUCED = { hold: 140, fade: 200 }

/**
 * Hard stop. If a timer is throttled, an animation event never lands or the
 * tab is backgrounded mid-sequence, this closes the overlay anyway. The
 * dashboard can never end up permanently behind it.
 */
const WATCHDOG = 7000

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export function PortalWelcome() {
  const { user, isStaff, loading } = useAuth()
  const { pathname } = useLocation()
  // 'idle' -> 'playing' -> 'closing' -> 'done'
  const [phase, setPhase] = useState('idle')
  // Read once for this page load. Cheap, and it keeps the decision out of the
  // effect that starts the sequence.
  const [reduced] = useState(prefersReducedMotion)
  const skipRef = useRef(null)
  const restoreFocusRef = useRef(null)

  // Only once an authenticated portal route is actually established — never on
  // the public site, never on the login screen itself.
  const onPortalRoute = pathname.startsWith('/portal') && pathname !== '/portal/login'
  const authenticated = !loading && Boolean(user) && isStaff

  useEffect(() => {
    if (phase !== 'idle') return undefined
    if (!authenticated || !onPortalRoute) return undefined
    // claimWelcomeAnimation() is what makes this once-per-sign-in: it consumes
    // the flag that PortalLoginPage set after a successful sign-in.
    if (!claimWelcomeAnimation()) return

    // Next task rather than this one, so the dashboard underneath has painted
    // before the overlay covers it — if anything in the sequence misbehaves,
    // what is revealed afterwards is a screen that already rendered. A timeout
    // rather than requestAnimationFrame: rAF does not fire in a hidden tab, so
    // a sign-in completed in a background tab would leave the sequence armed
    // and fire it minutes later when the tab was brought forward.
    const start = window.setTimeout(() => setPhase('playing'), 0)
    return () => window.clearTimeout(start)
  }, [authenticated, onPortalRoute, phase])

  const finish = useCallback(() => {
    setPhase((current) => (current === 'playing' ? 'closing' : current))
  }, [])

  // Timers, key handling, focus and scroll lock all live and die together with
  // the playing phase, so skipping tears every one of them down at once.
  useEffect(() => {
    if (phase !== 'playing') return undefined

    const timing = reduced ? REDUCED : FULL
    const timers = [
      window.setTimeout(finish, timing.hold),
      window.setTimeout(() => setPhase('done'), timing.hold + timing.fade),
      window.setTimeout(() => setPhase('done'), WATCHDOG),
    ]

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
        return
      }
      // The overlay owns the screen while it plays, and Skip is its only
      // control, so Tab keeps focus there rather than wandering into the
      // dashboard behind it.
      if (event.key === 'Tab') {
        event.preventDefault()
        skipRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    restoreFocusRef.current = document.activeElement
    skipRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [phase, reduced, finish])

  // The fade-out is a CSS animation; this is the timer that retires the node if
  // its animationend never arrives.
  useEffect(() => {
    if (phase !== 'closing') return undefined
    const timing = reduced ? REDUCED : FULL
    const timer = window.setTimeout(() => setPhase('done'), timing.fade + 80)
    return () => window.clearTimeout(timer)
  }, [phase, reduced])

  // Hand focus back where it was, once the overlay is gone.
  useEffect(() => {
    if (phase !== 'done') return
    const previous = restoreFocusRef.current
    restoreFocusRef.current = null
    if (previous && typeof previous.focus === 'function' && document.contains(previous)) {
      previous.focus()
    }
  }, [phase])

  if (phase === 'idle' || phase === 'done') return null

  const timing = reduced ? REDUCED : FULL

  return (
    <div
      className={`mm-welcome${phase === 'closing' ? ' is-closing' : ''}`}
      data-reduced={reduced ? 'true' : undefined}
      style={{ '--mm-fade': `${timing.fade}ms`, '--mm-heart-mask': `url(${WELCOME_HEART_SRC})` }}
      onAnimationEnd={(event) => {
        if (phase === 'closing' && event.target === event.currentTarget) setPhase('done')
      }}
    >
      {/* Purely decorative. Assistive technology gets the one-line status
          below instead of a running commentary on beats and ripples. */}
      <div className="mm-welcome__stage" aria-hidden="true">
        {!reduced
          ? RIPPLES.map((ripple) => (
              <span
                key={ripple.name}
                className="mm-welcome__ripple"
                style={{ '--mm-ripple-color': ripple.color, '--mm-ripple-delay': `${ripple.delay}ms` }}
              />
            ))
          : null}

        {!reduced ? (
          <div className="mm-welcome__heart">
            <img src={WELCOME_HEART_SRC} alt="" className="mm-welcome__heart-art" />
            <span className="mm-welcome__heart-gloss" />
            <span className="mm-welcome__heart-depth" />
          </div>
        ) : null}

        <img src={brandLogoPath} alt="" className="mm-welcome__logo" />
      </div>

      <p className="mm-welcome__sr" role="status">
        Signed in. Opening the team portal.
      </p>

      <button ref={skipRef} type="button" className="mm-welcome__skip" onClick={finish}>
        Skip
      </button>
    </div>
  )
}
