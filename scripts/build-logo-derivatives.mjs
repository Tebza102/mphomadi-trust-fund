// Generates the resized copies of the horizontal logo used through srcset.
//
//   node scripts/build-logo-derivatives.mjs
//
// The original (mpho-madi-logo-horizontal.png, 1672x941) is the source of
// truth and is never modified. Each derivative is a plain Lanczos3 resample of
// it: same sRGB colour space, same RGBA transparency, no palette reduction, no
// sharpening, no other processing - so the artwork itself is unchanged, only
// its pixel count. Output is deterministic (same input + same sharp/libvips
// version -> byte-identical files), and the generated PNGs are committed, so a
// normal build never depends on sharp. Re-run only if the original changes.
//
// Widths were chosen from measured displayed-size comparisons (2026-10-18):
//   327w  header (64px tall desktop / 44px mobile, up to ~3x density)
//   629w  arrival animation logo at 1x desktop and 2x mobile
//   1107w arrival animation logo at 2x desktop and 3x mobile
// Each height is the integer closest to the original aspect ratio (error
// below 0.04% for every size), and the original stays the 1672w candidate.
import path from 'node:path'

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch (error) {
  console.error('Could not load sharp, so no derivatives were generated:')
  console.error(`  ${error.message.split('\n')[0]}`)
  process.exit(1)
}

const DIR = path.join(process.cwd(), 'public', 'images', 'branding')
const SOURCE = path.join(DIR, 'mpho-madi-logo-horizontal.png')
const SIZES = [
  [327, 184],
  [629, 354],
  [1107, 623],
]

const meta = await sharp(SOURCE).metadata()
if (meta.width !== 1672 || meta.height !== 941 || !meta.hasAlpha || meta.space !== 'srgb') {
  console.error(`Unexpected source logo (${meta.width}x${meta.height}, ${meta.space}, alpha=${meta.hasAlpha}); refusing to continue.`)
  process.exit(1)
}

for (const [width, height] of SIZES) {
  const target = path.join(DIR, `mpho-madi-logo-horizontal-${width}w.png`)
  const info = await sharp(SOURCE)
    .resize(width, height, { kernel: 'lanczos3', fit: 'fill' })
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true, palette: false })
    .toFile(target)
  console.log(`${path.basename(target)}  ${info.width}x${info.height}  ${info.size} bytes`)
}
