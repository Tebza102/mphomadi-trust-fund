# Logo derivatives — QA record (approved 2026-10-18)

Branch `perf/logo-derivatives` (`d3ac14d`). Approved by Tebogo on 2026-10-18, on these conditions: the original official logo stays unchanged, it stays recognisable and balanced at normal size, there are no colour or artwork changes, the deterministic generation script is kept, and the responsive `srcset` selection is kept.

## What was made
`scripts/build-logo-derivatives.mjs` resamples `public/images/branding/mpho-madi-logo-horizontal.png` (1672x941, SHA-256 `e3bb5897…a185f`, unchanged) with sharp Lanczos3, sRGB RGBA, no palette and no sharpening. Two runs produced byte-identical output.

| File | Pixels | Bytes | Aspect error |
|---|---|---|---|
| mpho-madi-logo-horizontal-327w.png | 327x184 | 29,218 | 0.03% |
| mpho-madi-logo-horizontal-629w.png | 629x354 | 74,296 | <0.01% |
| mpho-madi-logo-horizontal-1107w.png | 1107x623 | 182,351 | <0.01% |
| original (1672w candidate) | 1672x941 | 404,952 | — |

## Which file each screen downloads (Chromium)
Header `sizes="(min-width: 768px) 128px, 79px"`; arrival logo `sizes="(min-width: 650px) 520px, 80vw"`.

| Screen | Header | Arrival logo |
|---|---|---|
| Desktop 1x | 327w | 629w |
| Desktop 2x / tablet 2x | 327w | 1107w |
| Desktop 3x | 629w | original |
| Mobile 2x | 327w | 629w |
| Mobile 2.625x / 3x / 3.5x | 327w | 1107w |

## Visual comparison
Both images below were rendered by Chromium at the real CSS size and device pixel ratio. Left: the original as scaled by the browser. Right: the derivative.

- `normal-size-comparison.png`: every case at 1:1 device pixels.
- `magnified-comparison.png`: the worst cases, enlarged with nearest-neighbour.

| Case | DPR | File | Device px | Mean abs. diff (0–255) | Mean ΔE76 | 99th pct ΔE76 |
|---|---|---|---|---|---|---|
| header desktop | 1x | 327w | 128x72 | 2.61 | 1.26 | 20.2 |
| header desktop | 2x | 327w | 256x144 | 1.25 | 0.62 | 10.6 |
| header desktop | 3x | 629w | 384x216 | 1.18 | 0.61 | 13.3 |
| header mobile | 2x | 327w | 158x88 | 2.50 | 1.25 | 18.4 |
| header mobile | 3x | 327w | 237x132 | 1.17 | 0.59 | 10.3 |
| header mobile | 3.5x | 327w | 277x154 | 1.28 | 0.64 | 11.2 |
| arrival desktop | 1x | 629w | 520x293 | 0.75 | 0.40 | 9.1 |
| arrival desktop | 2x | 1107w | 1040x586 | 0.50 | 0.27 | 6.7 |
| arrival mobile | 2x | 629w | 624x352 | 0.77 | 0.41 | 9.4 |
| arrival mobile | 3x | 1107w | 936x528 | 0.48 | 0.26 | 6.1 |

The accepted difference: at 1x desktop and 2x mobile header sizes, the thin red and blue rules beside "TRUST FUND" are narrower than one device pixel. Chromium's ~13x downscale of the original is aliased and keeps them saturated; a correctly filtered copy spreads them, so they look slightly paler. The 629w copy behaves the same. Flat brand colours are unchanged; the remaining differences are at anti-aliased edges.
