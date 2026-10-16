# Website motion & interaction rollout plan (PLAN ONLY — nothing here is implemented)

Implemented so far: Trustees Portrait Spotlight only (`src/components/TrusteeSpotlight.jsx`).
Existing motion to build on: `Reveal` (fade + 20px lift on scroll, reduced-motion aware, used on Home, StoryTimeline, StoryVideoAppeal), `donate-pulse` keyframe, `transition-colors` hovers in header/footer, the portal welcome animation (separate branch), a global `:focus-visible` ring.
Existing gaps: no shared timing/easing tokens (values are hard-coded per component); reduced-motion handling is per component.

## Design principle: use available space intentionally (applies to all future work below)

Origin: the first Trustee Spotlight stacked a small portrait above a narrow text column inside a wide panel, leaving large dead areas. It was fixed by (1) reflowing on the *component's* width (CSS container query) rather than the viewport, (2) floating the portrait so name, role and opening paragraphs sit beside it and the rest flows beneath, (3) framing the portrait non-destructively (the supplied photos carry ~22% white margin; the frame shows them at 1.35x without altering the files), and (4) capping the panel width so line length stays ~85-90 characters.

Rules for Home, Mpho's Story, How We Help, Sponsor and Donate (future work only — not authorised for implementation yet):
- Image + text are one composition: prefer floated/side-by-side flow over an image stacked above a narrow column; text may wrap beside the image and continue beneath it using clean rectangular gutters (never wrapped tight to a silhouette).
- Reflow on the container's width (`@container`), not just viewport breakpoints; a wide viewport can still host a narrow component.
- Check every photo for built-in margins/whitespace before sizing it; fix with non-destructive framing (zoom/object-position), never by editing the approved asset.
- Cap reading width (~65-90 characters) and balance the rest of the space with the image, not with empty columns.
- Whitespace is for hierarchy and rhythm, not leftover area: if a region is empty only because the layout ran out of content, recompose it.
- Motion supports the story (e.g. image moves into its place) and must land on the same framing the static layout uses.
- Verification for any future section: screenshot at 390 / 820 / 1024 / 1280 / 1440 and review the composition itself, not just that it builds. Note: Tailwind in this repo does not generate `@container` / `@2xl:` utilities, so container queries live in `src/index.css` (see `.spotlight-*`).

## 0. Reusable motion system (do first; small)

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 0.8, 0.24, 1)` | all entrances / movement |
| `--dur-press` | 150–200ms | hover, press, focus feedback |
| `--dur-reveal` | 300–350ms | content fades/lifts (matches `Reveal`) |
| `--dur-move` | 400–450ms | shared-element / panel movement |
| `--dur-exit` | 250–300ms | closes, dismissals |

Rules: only animate `opacity` and `transform`; never animate layout properties for scroll-driven effects; content must be in the DOM and readable without motion; every effect checks `prefers-reduced-motion` (CSS `motion-reduce:` or the existing `matchMedia` pattern) and degrades to no motion, never to hidden content; no looping animation except the existing donate pulse (review it — see D); one primary motion per viewport.
Conventions: extend `Reveal` with an optional `delay`/`distance` rather than adding a library; put tokens in `index.css` `:root`; keep imperative WAAPI code (as in the Spotlight) for one-off choreography.
Complexity: S. Verification: lint/build, reduced-motion emulation, visual check of Home/About for no regressions.

## A. Homepage (priority 1)
| Opportunity | Proposal | Visitor benefit | Deps / a11y / perf | Complexity | Verify |
|---|---|---|---|---|---|
| Hand-off from heart-and-hands intro to hero | Audit timing so the hero text is readable the moment the intro ends; fade the hero in under the intro instead of after it | No dead pause or double-animation | Existing intro code only; skip intro under reduced motion (check it already does) | S–M | Record screen at 3 widths; time-to-readable-hero |
| Section transitions | Apply existing `Reveal` consistently, stagger cards ≤ 60ms | Calm, consistent pacing | No new deps; no hidden content if IO unsupported (already handled) | S | Scroll-through, reduced-motion |
| CTA clarity | Same hover/press feedback tokens on all primary buttons | Predictable controls | CSS only | S | Visual + keyboard focus |

## B. Mpho's Story (priority 2)
- Problem: long narrative; visitors lose place. Proposal: restrained image reveals (opacity + 8–12px lift via `Reveal`) tied to each timeline beat; sticky year/chapter label in `StoryTimeline`. Benefit: orientation and pacing.
- Deps: existing `StoryTimeline`, `Reveal`. A11y: all text present in DOM, no scroll-jacking, no scroll-linked hiding; video keeps its own controls. Perf: lazy images already; avoid parallax. Complexity M. Verify: keyboard-only scroll, reduced-motion, CLS check.

## C. How We Help (priority 3)
- Problem: support areas read as dense text. Proposal: card grid using the Spotlight pattern *only if* each area has substantial detail; otherwise a native `<details>` list with a 250ms height/opacity transition. Benefit: scan first, read depth on demand.
- Deps: none new. A11y: disclosure semantics, focus visible. Perf: negligible. Complexity S–M. Verify: content parity test (same method as trustees), keyboard.
- Note: confirm where this content lives (no dedicated page found; may be a Home section).

## D. Sponsor & Donate (priority 4 — usability over decoration; do not touch payment/banking logic)
- Problem/opportunity: pathway clarity and reassurance. Proposals: (1) step/progress cue between amount → details → confirm with a 200ms state transition; (2) inline validation messages that fade in with `role="alert"`, never shift the submit button; (3) review `donate-pulse` (infinite) against "no continuous animation" — consider stopping after a few cycles or on interaction; (4) copy-to-clipboard feedback on bank details ("Copied", 1.5s) — display only.
- A11y: errors announced, focus moved to first error, no motion-only meaning. Perf: none. Complexity M (UI only; wrapper components, no change to submit logic). Verify: existing `test:intake`, manual donation-form walkthrough in test mode, reduced-motion.
- Measure after launch (do not assume uplift): form start→completion rate, validation-error rate per field, bank-detail copy events — needs analytics decision first (none found in the repo).

## E. Global navigation & micro-interactions (priority 5)
- Shared hover/press/focus recipe (colour + 1–2px lift, 150–200ms), mobile menu open/close fade+slide 250ms with focus management, route-change fade ≤ 150ms only if it can be done without delaying content.
- A11y: keep the 3px focus ring; ensure 44px targets (already `min-h-11` on buttons). Perf: CSS only. Complexity S (tokens) / M (route fade). Verify: keyboard tour, Lighthouse, reduced-motion.

## Suggested order
1. Tokens + `Reveal` options (S) → 2. Home hand-off audit (S–M) → 3. Nav/button micro-interactions (S) → 4. Story pacing (M) → 5. How We Help disclosure (S–M) → 6. Donate usability layer (M, after analytics + payment-owner sign-off).

## Cross-cutting verification
Lint + build; reduced-motion emulation; 390/820/1440 screenshots; keyboard-only run-through; console clean (aside from the known Firebase env message locally); content-integrity check wherever copy is touched; Lighthouse performance/CLS before vs after.
