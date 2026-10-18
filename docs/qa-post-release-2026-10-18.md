# Post-release QA, asset and measurement review — 2026-10-18

Baseline: `main` @ `5bb0387`, production deployment `dpl_CXLeWikhtcVFkD5QQSB4k6s9nt3j` (project `website`).
QA branch: `qa/post-release-review`. Preview only; nothing merged or promoted.
Tooling: Playwright 1.62.1 Chromium (headless), CDP network/CPU emulation. **Not covered:** WebKit/Safari, Firefox, Samsung Internet (engines not installed; installing them is a download that needs approval). **Lighthouse was not run** (also a download); LCP/CLS/FCP/TBT were measured with PerformanceObservers.

## Findings (no Blocker or High found)

| # | Severity | Finding | Evidence | Action |
|---|---|---|---|---|
| 1 | Medium | On slow connections the logo (405 kB) and heart (221 kB) preloads share bandwidth with the JS bundle, so the whole page (and the overlay) starts late. | Cold cache, 390x844: overlay first frame 4.65 s @1.6 Mbps and 10.2 s @700 kbps on production; JS finished at 4.5 s / 10.0 s. | **Fixed**: heart preloads with the bundle, logo only after the heart lands. Overlay now starts 3.4 s / 7.2 s. Caveat below. |
| 2 | Medium | Reduced-motion first arrival preloads the heart (221 kB) that is never rendered; Chrome logs an unused-preload warning. | Console warning reproduced on production at 1280x800 reduced. | **Fixed**: reduced motion preloads only the logo. Warning gone on preview. |
| 3 | Medium | JS bundle 928.56 kB raw / 277.48 kB gzip is loaded by every public page. Firebase is ~60 % of source: firestore 36 %, auth 13 %, app-check 2 %, util/app/functions ~5 %; react-dom 16 %, react-router 11 %, re2js 8.5 %, app code 5 %. | Sourcemap analysis of a production build. | Recommend lazy-loading portal/admin routes and the Firebase providers. Not done: a broad refactor needs approval. |
| 4 | Medium | Header/welcome logo is a 1672x941 PNG (405 kB) displayed at ≤114 px wide in the header and ≤520 px in the welcome. Lossless recompression only saves 9.6 %. | Measured. A 1044 px-wide resample is 176 kB (-57 %), 836 px is 120 kB (-70 %). | Lossless version shipped. A resized derivative is **not** shipped: it changes the official artwork file and needs brand approval. |
| 5 | Low | Google Fonts is pulled in via CSS `@import` (serial chain), and the web-font swap causes small layout shifts (CLS 0.02–0.096; 0.096 at 768x1024 from header nav reflow; most occur behind the overlay). | Layout-shift sources captured on production. | Not changed. Fix means self-hosting/preloading fonts with size-adjust fallbacks (font files must be downloaded). |
| 6 | Low | `/images/*` is served `Cache-Control: public, max-age=0, must-revalidate`, so returning visitors revalidate every image. | `curl -I` on production. | Not changed (`vercel.json` is production config). Suggest `max-age=86400, stale-while-revalidate=604800` or content-hashed filenames. |
| 7 | Observation | Vercel Preview builds have no Firebase env vars: console shows "Firebase config incomplete", portal unavailable on previews. Production is fine. | Preview console. | Needs a decision on Preview env vars. Not changed. |
| 8 | Observation | Unauthenticated `/admin` redirects to `/`; the welcome then plays on the home page (never over an admin route). | Journey J15. | By design; the test now asserts "never over a staff route". |
| 9 | Observation | With sessionStorage throwing, the welcome replays on every refresh (documented, skippable, still ends, no errors). | J11/J11b. | None. |
| 10 | Observation | Measured hold is 7.7–8.0 s vs 7.55 nominal (total ≈ 8.45–8.8 vs 8.25) because timers start after React commits and detection is per animation frame. | 11 runs. | Within tolerance; reported separately from network. |
| 11 | Observation | Header/footer logo `width`/`height` and footer `loading="lazy"` had no measurable effect (CLS unchanged; footer logo still loads inside Chrome's lazy-load distance). | A/B on preview. | Reverted (no speculative changes). |

Slow-network caveat for fix 1: at 700 kbps the logo (requested after the heart) was still downloading when the heart turns into the logo (6 s in), because the hero images compete with it. At 1.6 Mbps (Lighthouse's mobile profile) it is ready with ~1.7 s to spare. Skip and the 10 s watchdog work regardless.

## Measurements (production vs preview candidate)

Mobile profile: 390x844, 1.6 Mbps / 150 ms, 4x CPU, cold cache, median of 3.

| Metric | Production | Candidate |
|---|---|---|
| FCP | 6.62 s | 5.20 s |
| LCP | 8.06 s | 6.47 s |
| CLS | 0.046 | 0.046 |
| TBT (long-task proxy) | 3 ms | 0 ms |
| DOMContentLoaded | 5.29 s | 3.94 s |
| Requests / transfer | 12 / 1507 kB | 12 / 1428 kB |

Desktop 1440x900 unthrottled, median of 3: FCP 1.61 → 1.28 s, LCP 1.64 → 1.58 s, CLS 0.001, TBT ≈ 0.

Overlay first frame (cold cache, 390x844): production 4.65 s @1.6 Mbps, 10.2 s @700 kbps → candidate 3.4 s, 7.2 s. The heart is loaded before the overlay starts in every case.

## Assets (lossless; pixel-identical RGBA verified — zero differing pixels; edges compared magnified)

| File | Format / px | Before | After | Saving |
|---|---|---|---|---|
| mpho-madi-heart.png | PNG RGBA 512x443 | 220,971 B | 178,926 B | 42,045 B (19.0 %) |
| mpho-madi-logo-horizontal.png | PNG RGBA 1672x941 | 404,952 B | 366,119 B | 38,833 B (9.6 %) |
| mpho-madi-logo-horizontal-white.png | PNG RGBA 900x300 | 111,583 B | unchanged (re-encode was 20 % larger) | – |
| 04_mpho-with-founder-childhood.webp (hero) | WebP 1920x1280 | 237,380 B | unchanged | – |
| 12_mpho_at_three.webp | WebP 1084x1451 | 177,426 B | unchanged | – |
| Trustee photos (4) | JPEG 600x600 | 25–35 kB each | unchanged | – |

Loading: header logo — React `<img>` at mount (preloaded after the heart, first arrival only); heart — preload on first non-reduced arrival + welcome `<img fetchpriority=high>`; hero — `eager` Picture; footer logo and at_three — inside Chrome's lazy-load distance; trustee photos — lazy.

## Analytics

No analytics provider exists in the repo (no Vercel Analytics/Speed Insights, GA, Firebase Analytics, Plausible), and no consent banner. Nothing was installed.

Recommendation: Vercel Web Analytics (cookieless, no identifiers; confirm the plan includes custom events) or a privacy-first tool such as Plausible. Needs: enabling it in the Vercel project, one dependency, about half a day to add `track()` calls to `SiteWelcome`, guarded by a per-page-load ref so StrictMode, Skip and the watchdog fire each event exactly once.

Events: `site_welcome_started`, `site_welcome_completed`, `site_welcome_skipped`.
Properties (no PII, no URLs): `mode` = arrival | reduced | pulse; `skip_method` = click | touch | escape | enter | space; `route_category` = home | story | about | donate | contact | other; `elapsed_bucket` = <1s | 1–3s | 3–6s | 6–8.25s | watchdog; `device` = mobile | tablet | desktop (the provider's own category).

Evaluation: completion rate (completed ÷ started, arrival mode), skip rate and where visitors skip (elapsed bucket), reduced-motion share, mobile vs desktop completion, and what visitors do next (a second pageview or a Donate/Contact click in the session). Compare LCP/INP before and after with the same provider. These are behavioural proxies: they cannot show that visitors liked the animation, only that they stayed, skipped or moved on.

## Rollback
Nothing here is in production. To discard: delete branch `qa/post-release-review` and its Preview deployments. If promoted later and a problem appears: `vercel rollback dpl_CXLeWikhtcVFkD5QQSB4k6s9nt3j` (project `website`), or revert the commits on `main`; the previous PNGs are in `5bb0387`.
