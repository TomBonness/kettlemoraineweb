import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

// Every raster logo derives from the designer's vector mark, so a refined mark means replacing
// src/assets/brand/kettle-moraine-mark.svg and re-running this script. Then run `npm run
// assets:marketing` (the social cards carry the wordmark), and bump the `?v=` on the icon links in
// index.html and `socialImageVersion` in src/lib/pageMetadata.ts so cached icons and link
// previews refresh.
const root = fileURLToPath(new URL('../', import.meta.url))
const asset = (name) => path.join(root, name)

const markSvg = await readFile(asset('src/assets/brand/kettle-moraine-mark.svg'), 'utf8')
const markBody = markSvg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '').replace(/<title>[\s\S]*?<\/title>/, '')
const [viewX, viewY, viewWidth] = markSvg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)

/** The mark's ink box in its own units, measured by rendering it large and trimming. */
async function inkBox() {
  const scale = 8
  const { info } = await sharp(Buffer.from(markSvg), { density: 72 * scale })
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true })
  const unit = (scale * 512) / viewWidth
  return {
    x: viewX - info.trimOffsetLeft / unit,
    y: viewY - info.trimOffsetTop / unit,
    width: info.width / unit,
    height: info.height / unit,
  }
}

const ink = await inkBox()

/**
 * The mark's ink drawn `height` px tall at (x, y). Square tiles centre the ink rather than the dot:
 * the right bracket reaches further from the dot than the left two, so a centred dot sits the mark
 * visibly right of centre.
 */
function markAt(x, y, height) {
  const width = (height * ink.width) / ink.height
  return {
    width,
    svg: `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${ink.x} ${ink.y} ${ink.width} ${ink.height}">${markBody}</svg>`,
  }
}

function centred(size, height) {
  return markAt((size - (height * ink.width) / ink.height) / 2, (size - height) / 2, height).svg
}

async function save(name, svg, overlays = []) {
  const output = asset(name)
  const { width, height } = await sharp(Buffer.from(svg)).composite(overlays).png({ compressionLevel: 9 }).toFile(output)
  console.log(`${path.relative(root, output)} — ${width} × ${height}`)
}

// The mark on its own, at the designer's scale.
await save(
  'public/brand/kettle-moraine-mark.png',
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">${centred(512, (ink.height * 512) / viewWidth)}</svg>`,
)

// Icons: the mark on a rounded canvas tile, its ink 64% of the tile's height.
for (const [name, size] of [
  ['public/kettle-moraine-favicon-16.png', 16],
  ['public/kettle-moraine-favicon-32.png', 32],
  ['public/kettle-moraine-favicon.png', 64],
  ['public/kettle-moraine-apple-touch-icon.png', 180],
]) {
  await save(
    name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.17}" fill="#f7f7f3"/>${centred(size, size * 0.64)}</svg>`,
  )
}

// The wordmark: the mark beside the lockup's type, with the margins and gap of the original lockup.
const lockup = { height: 374, margin: 20, markHeight: 334, gap: 41, typeTop: 119 }
const typeFile = asset('artwork/brand/kettle-moraine-wordtype.png')
const type = await sharp(typeFile).metadata()
const mark = markAt(lockup.margin, lockup.margin, lockup.markHeight)
const typeLeft = Math.round(lockup.margin + mark.width + lockup.gap)
await save(
  'public/brand/kettle-moraine-wordmark.png',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${typeLeft + type.width + lockup.margin}" height="${lockup.height}">${mark.svg}</svg>`,
  [{ input: typeFile, left: typeLeft, top: lockup.typeTop }],
)
