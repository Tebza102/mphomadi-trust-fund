/**
 * Session memory for the arrival animation.
 *
 * One question only: has this visitor already been welcomed during this
 * browser session? Nothing here knows or cares who the visitor is — the
 * animation is the public site's front door, not a portal concern.
 *
 * sessionStorage rather than localStorage: "this sitting, this tab". A new tab
 * or a browser restart is a new arrival and earns the welcome again; nothing
 * outlives the browser closing.
 */
const KEY = 'mm.site.arrival'
const SEEN = 'seen'

/**
 * Per page-load memo of the claim result.
 *
 * React StrictMode invokes mount effects twice in development, and a claim
 * that wrote the flag on the first call would answer "already seen" on the
 * second — the welcome would never appear while developing. Memoising for the
 * life of this page load makes the claim idempotent: every caller in one page
 * load gets one answer, while a refresh gets a fresh module that reads the
 * stored flag and correctly declines.
 *
 * `undefined` means "not claimed yet in this page load".
 */
let pageLoadVerdict

function readFlag() {
  try {
    return window.sessionStorage.getItem(KEY)
  } catch {
    // Storage blocked (private mode, cookies-off, embedded webview). Treated
    // as "no record", which means the welcome plays. It is always skippable
    // and always self-closing, so the worst case is a visitor who sees the
    // introduction again after a refresh — never one who is held up by it.
    return null
  }
}

function writeFlag() {
  try {
    window.sessionStorage.setItem(KEY, SEEN)
  } catch {
    /* Nothing to do; see readFlag. */
  }
}

/**
 * True exactly once per browser session: on the visitor's first arrival from
 * outside. Every later page load in the same session — refresh included —
 * returns false.
 */
export function claimArrival() {
  if (pageLoadVerdict !== undefined) return pageLoadVerdict

  const alreadySeen = readFlag() === SEEN
  if (!alreadySeen) writeFlag()
  pageLoadVerdict = !alreadySeen
  return pageLoadVerdict
}

/** Whether the full welcome has already run this session. Read-only. */
export function hasSeenArrival() {
  return readFlag() === SEEN
}

/** Heart mark derived from the approved logo by scripts/extract-heart.mjs. */
export const HEART_SRC = '/images/branding/mpho-madi-heart.png'
