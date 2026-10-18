// Generates the tightly cropped header logo used through srcset.
//
//   node scripts/build-header-logo.mjs
//
// The original (mpho-madi-logo-horizontal.png, 1672x941) is the source of
// truth and is never modified. About half its height is transparent margin
// (only ~250 stray pixels at alpha <= 6, i.e. invisible, sit outside the
// artwork), so sizing the full canvas in CSS leaves the visible logo small.
// This crops to the artwork's bounding box (every pixel above alpha 2, plus a
// 6px safety margin so antialiased edges are kept), then makes plain Lanczos3
// resamples: same sRGB colour space, same RGBA transparency, no palette
// reduction, no sharpening. The artwork and its proportions are unchanged.
// Output is deterministic and committed, so a normal build never needs sharp.
//
// Widths cover the header's displayed sizes (about 136-205 CSS px wide) at
// 1x-3x density.
import path from 'node:path'

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch (error) {
  console.error('Could not load sharp, so no header logo was generated:')
  console.error(`  ${error.message.split('\n')[0]}`)
  process.exit(1)
}

const DIR = path.join(process.cwd(), 'public', 'images', 'branding')
const SOURCE = path.join(DIR, 'mpho-madi-logo-horizontal.png')
const ALPHA_THRESHOLD = 2
const SAFETY = 6
const WIDTHS = [400, 600, 800]

const meta = await sharp(SOURCE).metadata()
if (meta.width !== 1672 || meta.height !== 941 || !meta.hasAlpha || meta.space !== 'srgb') {
  console.error(`Unexpected source logo (${meta.width}x${meta.height}, ${meta.space}, alpha=${meta.hasAlpha}); refusing to continue.`)
  process.exit(1)
}

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
let left = info.width, top = info.height, right = -1, bottom = -1
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > ALPHA_THRESHOLD) {
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
}
left = Math.max(0, left - SAFETY)
top = Math.max(0, top - SAFETY)
right = Math.min(info.width - 1, right + SAFETY)
bottom = Math.min(info.height - 1, bottom + SAFETY)
const crop = { left, top, width: right - left + 1, height: bottom - top + 1 }
console.log(`crop ${crop.width}x${crop.height} at ${crop.left},${crop.top}`)

const cropped = await sharp(SOURCE).extract(crop).png().toBuffer()
for (const width of WIDTHS) {
  const height = Math.round((crop.height * width) / crop.width)
  const target = path.join(DIR, `mpho-madi-logo-header-${width}w.png`)
  const out = await sharp(cropped)
    .resize(width, height, { kernel: 'lanczos3', fit: 'fill' })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true, palette: false })
    .toFile(target)
  console.log(`${path.basename(target)}  ${out.width}x${out.height}  ${out.size} bytes`)
}
