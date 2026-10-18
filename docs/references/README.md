# Mpho Madi Trust Fund — visual references for PR #4

## Source and priority

1. **04-client-approved-enlarged-mobile-concept.png** — client-approved *visual direction* for mobile: prominent correctly proportioned Trust logo, less visually dominant Donate/Menu buttons, balanced headings. This is AI-generated from the selected screenshot and may distort logo/text/browser chrome; NOT an exact pixel-level source of truth. Use existing production assets and exact site wording.
2. **03-client-selected-mobile-thumbnail.png** — the small image supplied by Tebogo that was used as the reference for the enlarged concept.
3. **01-original-live-mobile.png** and **02-original-live-desktop.png** — actual live site reference captures supplied by Tebogo; preserve identity, imagery, hierarchy and existing content.
4. **05-previous-preview-mobile-mismatch.png** — actual preview screenshot supplied by Tebogo showing unwanted balance and whitespace; negative reference, not desired state.
5. **06-earlier-comparison-illustration-not-authoritative.png** — illustrative only; not an implementation reference.

## Implementation guidance

- Work on existing branch `fix/readability-heading-logo-balance` and draft PR #4; current reported HEAD `5a1ca37`. Fetch remote state before writing.
- Correct the **underlying transparent margins** in the logo PNG using a derivative asset preserving original artwork (do not replace with generative logo). Size visible ink, not just CSS image box.
- Make logo first in header visual hierarchy, reduce Donate/Menu visual prominence via width/padding without shrinking touch targets below 44 CSS px.
- Reduce excessive blank space and balance hero typography; keep readable paragraph size and text enlargement.
- CRITICAL: fix 200% mobile text enlargement causing horizontal overflow and logo squeezing, without sacrificing mobile navigation.
- Verify actual rendered preview on real device-sized viewports, capture screenshots and compare; do not use generated illustration as pixel-exact template.
- Trustee order: Pule → Ntombi → Mpumi → Hilary already completed; keep it intact.
- Build/lint/test, validate zoom/reflow, no production merge until explicit sign-off.
