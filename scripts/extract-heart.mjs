/**
 * Derives the standalone heart mark used by the post-login welcome animation
 * from the approved production logo. Deterministic crop only — no redraw, no
 * recolour, no generated artwork.
 *
 * Method:
 *   1. Read public/images/branding/mpho-madi-logo-horizontal.png (1595x508,
 *      already RGBA with a transparent ground).
 *   2. Scan every column for "ink" pixels — alpha >= 16 and not near-white
 *      (any channel <= 242). The mark and the wordmark are separated by a
 *      fully empty column run (579-596 in the approved file), so the heart is
 *      simply everything left of that first gap.
 *   3. Tighten to the ink bounding box in both axes, add a small transparent
 *      margin so the shadow in the animation has room, then downscale to
 *      512px wide (Lanczos) so the login path does not carry a 500 KB asset.
 *
 * Colours, proportions and transparency are therefore identical to the
 * approved logo by construction. Re-run with: node scripts/extract-heart.mjs
 */
import sharp from 'sharp'

const SOURCE = 'public/images/branding/mpho-madi-logo-horizontal.png'
const TARGET = 'public/images/branding/mpho-madi-heart.png'
const MARGIN = 6
// Rendered at roughly 200-260 CSS px; 512 covers 2x displays without shipping
// a 500 KB asset into the login path.
const OUTPUT_WIDTH = 512

const isInk = (r, g, b, a) => a >= 16 && !(r > 242 && g > 242 && b > 242)

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height } = info

const columnHasInk = []
for (let x = 0; x < width; x += 1) {
  let ink = false
  for (let y = 0; y < height && !ink; y += 1) {
    const i = (y * width + x) * 4
    if (isInk(data[i], data[i + 1], data[i + 2], data[i + 3])) ink = true
  }
  columnHasInk.push(ink)
}

const firstInk = columnHasInk.indexOf(true)
if (firstInk < 0) throw new Error(`No ink found in ${SOURCE}`)
let markEnd = firstInk
while (markEnd + 1 < width && columnHasInk[markEnd + 1]) markEnd += 1

let top = height
let bottom = -1
for (let y = 0; y < height; y += 1) {
  for (let x = firstInk; x <= markEnd; x += 1) {
    const i = (y * width + x) * 4
    if (isInk(data[i], data[i + 1], data[i + 2], data[i + 3])) {
      if (y < top) top = y
      if (y > bottom) bottom = y
      break
    }
  }
}

const left = Math.max(0, firstInk - MARGIN)
const right = Math.min(width - 1, markEnd + MARGIN)
const boxTop = Math.max(0, top - MARGIN)
const boxBottom = Math.min(height - 1, bottom + MARGIN)

await sharp(SOURCE)
  .ensureAlpha()
  .extract({
    left,
    top: boxTop,
    width: right - left + 1,
    height: boxBottom - boxTop + 1,
  })
  .resize({ width: OUTPUT_WIDTH, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
  .png({ compressionLevel: 9, effort: 10, palette: false })
  .toFile(TARGET)

console.log(
  `heart mark: ${TARGET} — source columns ${firstInk}-${markEnd}, rows ${top}-${bottom}, ` +
    `crop ${right - left + 1}x${boxBottom - boxTop + 1}, output ${OUTPUT_WIDTH}px wide`,
)
