// Generates a .webp alongside every .jpg in public/images/photos.
// The .jpg stays as the <picture> fallback; webp is the primary source.
//
// Run manually (`npm run build:images`) after adding photos — deliberately NOT
// wired into `prebuild`. The generated .webp files are committed static assets,
// so a normal `vite build` must not depend on sharp's native binary, which can
// fail to load on locked-down machines (ERR_DLOPEN_FAILED under Windows
// Application Control). A blocked image tool should not break the site build.
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch (error) {
  console.error('Could not load sharp, so no images were converted:')
  console.error(`  ${error.message.split('\n')[0]}`)
  console.error('Existing .webp files in public/images/photos are untouched.')
  process.exit(1)
}

const PHOTO_DIR = path.join(process.cwd(), 'public', 'images', 'photos')
const WEBP_QUALITY = 82

const exists = async (file) => {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

const files = (await readdir(PHOTO_DIR)).filter((file) => file.endsWith('.jpg')).sort()

for (const file of files) {
  const source = path.join(PHOTO_DIR, file)
  const target = source.replace(/\.jpg$/, '.webp')

  if (await exists(target)) {
    const [sourceStat, targetStat] = await Promise.all([stat(source), stat(target)])
    if (targetStat.mtimeMs >= sourceStat.mtimeMs) {
      console.log(`skip  ${file} (webp is current)`)
      continue
    }
  }

  await sharp(source).webp({ quality: WEBP_QUALITY }).toFile(target)

  const [before, after] = await Promise.all([stat(source), stat(target)])
  const saved = Math.round((1 - after.size / before.size) * 100)
  console.log(`write ${path.basename(target)}  ${Math.round(after.size / 1024)}kB (-${saved}%)`)
}

// Trustee portraits: the approved 4:5 studio PNGs (1122x1402) live unmodified
// in assets/source/trustees, outside public/ so they never ship. This writes
// web-sized derivatives (800x1000 webp + jpg fallback) into public/ under the
// trustee's image stem. Width-only resize preserves the aspect ratio, so
// nothing is cropped or stretched.
const TRUSTEE_SOURCE_DIR = path.join(process.cwd(), 'assets', 'source', 'trustees')
const TRUSTEE_DIR = path.join(process.cwd(), 'public', 'images', 'trustees')
const TRUSTEE_PORTRAITS = {
  'Pule.webp.png': 'pule-malefane-portrait',
  'Hilary.webp.png': 'hilary-smith-portrait',
  'Ntombi.webp.png': 'ntombi-mekgwe-portrait',
  'Mpumi.webp.png': 'mpumi-madi-portrait',
}
const PORTRAIT_WIDTH = 800

for (const [file, stem] of Object.entries(TRUSTEE_PORTRAITS)) {
  const source = path.join(TRUSTEE_SOURCE_DIR, file)
  if (!(await exists(source))) {
    console.log(`miss  ${file} (source not found)`)
    continue
  }
  const sourceStat = await stat(source)

  for (const [ext, encode] of [
    ['webp', (image) => image.webp({ quality: WEBP_QUALITY })],
    ['jpg', (image) => image.jpeg({ quality: WEBP_QUALITY, mozjpeg: true })],
  ]) {
    const target = path.join(TRUSTEE_DIR, `${stem}.${ext}`)
    if ((await exists(target)) && (await stat(target)).mtimeMs >= sourceStat.mtimeMs) {
      console.log(`skip  ${stem}.${ext} (current)`)
      continue
    }
    await encode(sharp(source).resize({ width: PORTRAIT_WIDTH })).toFile(target)
    const { size } = await stat(target)
    console.log(`write ${stem}.${ext}  ${Math.round(size / 1024)}kB`)
  }
}
