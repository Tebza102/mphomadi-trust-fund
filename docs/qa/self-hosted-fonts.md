# Self-hosted fonts — not released (future improvement), 2026-10-18

Branch `perf/self-hosted-fonts`. Revision requested by Tebogo: mobile heart timing must stay within 150ms of production. Two controlled approaches were allowed; neither meets the gate, so this branch is kept for later and is **not** part of the release.

## What the branch does
- Serves the exact Google Fonts woff2 files (Fraunces v38, Source Sans 3 v20; latin + latin-ext, Google's unicode-ranges) from `/fonts`, with OFL licences. No requests to Google.
- Metric-matched `local()` fallback faces (Georgia / Noto Serif / Arial-Roboto).
- No font preload (a body-font preload delayed the overlay ~150ms and improved no LCP).

## Measurements: 390x844, 1.6 Mbps, 4x CPU, cold cache, 5 alternating runs each (medians)
Approach 1: heart preload with `fetchpriority="high"` (commit `bf4033a`).

| Metric | Production | Item 3 + approach 1 | Gate |
|---|---|---|---|
| Overlay first frame | 5429 ms | 5288 ms | must not regress: pass |
| Heart fully visible | 7141 ms | 7345 ms (+204) | ≤ +150 ms: **fail** |
| Overlay LCP | 7640 ms | 6332 ms | must not regress: pass |
| CLS (fresh arrival) | 0.046 | 0.0176 | ≤ 0.02: pass |
| Unused-preload warnings | – | none | pass |

Font-swap layout shift with fonts delayed 2.5s: worst case 0.062 → 0.018 (Windows), 0.161 → 0.018 (Android simulation).

Approach 2 (start font requests only after the heart has begun downloading) is already the case: the heart preload starts at ~0.5s and finishes at ~4.4s, while fonts are first requested at ~6.1s, after the JavaScript renders text. There was nothing left to delay.

## Cause of the remaining delay
Not bandwidth. The long task that mounts the overlay (4x CPU, local production builds, 3 runs each):

| Build | Mount long task (median) |
|---|---|
| main | ~690 ms |
| Item 3 | ~950 ms |
| Item 3 without the `local()` fallback faces | ~710 ms |

Resolving the `local()` fallback faces costs ~250ms of main-thread time on Chromium/Windows, and the heart's fade-in waits behind it.

## Options for later (each needs a decision; none implemented)
1. Ship self-hosting without the metric fallbacks: keeps the privacy gain and drops the Google request chain, but gives back the CLS improvement.
2. Keep the fallbacks but apply them only after the arrival sequence or on non-arrival page loads; needs care not to reintroduce layout shift.
3. Re-measure on real Android/iOS hardware, where `local()` lookup cost differs from Chromium on Windows.
