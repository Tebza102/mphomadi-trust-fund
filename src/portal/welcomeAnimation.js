/**
 * Replay control for the post-login welcome animation.
 *
 * The animation is a flourish, not a gate. Nothing here touches Firebase auth,
 * the ID token or the role claim — it only records "a team sign-in just
 * succeeded in this tab", so the overlay knows to play once and then stay out
 * of the way.
 *
 * sessionStorage (not localStorage) because the intent is "this tab, this
 * sitting": a new tab is a new sign-in journey, and nothing should survive the
 * browser closing.
 */
const KEY = 'mm.portal.welcome'

/**
 * Per page-load memo of the claim result.
 *
 * The overlay is mounted once at app level, but React StrictMode invokes mount
 * effects twice in development, and a claim that consumed the flag on the first
 * call would answer "no" on the second — the animation would never appear while
 * developing. Memoising the answer for the life of this page load makes the
 * claim idempotent: every caller in one page load gets the same verdict, while
 * a refresh starts a new module instance that finds the flag already consumed
 * and correctly declines to replay.
 *
 * `undefined` means "not claimed yet in this page load".
 */
let pageLoadVerdict

/** sessionStorage throws in some privacy modes; a missing flag just means "don't play". */
function readFlag() {
  try {
    return window.sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

function writeFlag(value) {
  try {
    if (value === null) window.sessionStorage.removeItem(KEY)
    else window.sessionStorage.setItem(KEY, value)
  } catch {
    /* Storage unavailable — the animation simply does not play. */
  }
}

/**
 * Called immediately after signInWithEmailAndPassword resolves, and only then.
 * A failed sign-in never reaches this, so a failed attempt cannot arm the
 * animation.
 */
export function armWelcomeAnimation() {
  pageLoadVerdict = undefined
  writeFlag('pending')
}

/**
 * True exactly once per armed sign-in. Consumes the flag, so a refresh or any
 * later navigation inside the same authenticated session finds nothing to play.
 */
export function claimWelcomeAnimation() {
  if (pageLoadVerdict !== undefined) return pageLoadVerdict

  const pending = readFlag() === 'pending'
  if (pending) writeFlag(null)
  pageLoadVerdict = pending
  return pending
}

/**
 * Called when auth reports no user — sign-out, session expiry, anything. Leaves
 * the next genuine sign-in free to arm the animation again.
 */
export function clearWelcomeAnimation() {
  pageLoadVerdict = undefined
  writeFlag(null)
}

/** Heart mark derived from the approved logo by scripts/extract-heart.mjs. */
export const WELCOME_HEART_SRC = '/images/branding/mpho-madi-heart.png'
