import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { routeMetadata } from '../src/lib/pageMetadata.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const asset = (name) => path.join(root, name)
// Fontconfig honors the bundled fonts on macOS as well as Linux.
process.env.FONTCONFIG_FILE = asset('artwork/fonts/fonts.conf')
process.env.PANGOCAIRO_BACKEND = 'fc'
const { default: sharp } = await import('sharp')
const width = 1200
const height = 630
const canvas = '#f7f7f3'
const graphite = '#11141b'
const light = '#f7f7f3'
const muted = '#b8c4dc'
const fonts = {
  serif: ['Source Serif 4 Medium', 'SourceSerif4.ttf'],
  italic: ['Source Serif 4 Medium Italic', 'SourceSerif4-Italic.ttf'],
  sans: ['Inter', 'Inter.ttf'],
}

function escapeMarkup(text) {
  return text.replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character])
}

// Font files are explicit: generated cards must not depend on a machine's installed fonts.
async function textLayer(text, left, top, size, font = 'serif', color = light) {
  const [family, filename] = fonts[font]
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `${family} ${size}`,
      fontfile: asset(`artwork/fonts/${filename}`),
      rgba: true,
      dpi: 72,
    },
  }).png().toBuffer({ resolveWithObject: true })
  if (left + info.width > width || top + info.height > height) {
    throw new Error(`Share-card text exceeds the canvas: ${text}`)
  }
  return { input: data, left, top }
}

function glow(background, color, cx = 75, cy = 60) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="light"><stop stop-color="${color}" stop-opacity=".7"/><stop offset="1" stop-color="${background}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="${background}"/><ellipse cx="${cx * 12}" cy="${cy * 6.3}" rx="510" ry="340" fill="url(#light)"/></svg>`)
}

async function masthead() {
  return [
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="80"><rect width="1200" height="80" fill="${canvas}"/></svg>`), left: 0, top: 0 },
    { input: await sharp(asset('public/brand/kettle-moraine-wordmark.png')).resize({ width: 235 }).png().toBuffer(), left: 62, top: 9 },
  ]
}

async function saveCard(route, layers) {
  const output = asset(`public${routeMetadata[route].image}`)
  await sharp({ create: { width, height, channels: 4, background: graphite } })
    .composite(layers)
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(output)
  console.log(`${path.relative(root, output)} — ${width} × ${height}`)
}

await mkdir(asset('public/social'), { recursive: true })

// The original concept render stays untouched. Only the homepage derivative is art-directed.
const product = await sharp(asset('src/assets/product/marketing/open-micro-transparent.webp'))
  .trim({ threshold: 5 })
  .rotate(-8, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .modulate({ brightness: 1.12 })
  .png()
  .toBuffer()
for (const size of [960, 1600]) {
  const output = asset(`src/assets/product/marketing/open-micro-home-${size}.webp`)
  const result = await sharp(product).resize({ width: size }).webp({ quality: 90 }).toFile(output)
  console.log(`${path.relative(root, output)} — ${result.width} × ${result.height}`)
}

const header = await masthead()
const companyContour = await sharp(asset('public/brand/contours.svg'))
  .resize({ width: 900, height: 550, fit: 'cover' }).png().toBuffer()
await saveCard('home', [
  { input: glow(graphite, '#123787'), left: 0, top: 0 },
  { input: companyContour, left: 300, top: 80 },
  ...header,
  await textLayer('You have', 64, 182, 136),
  await textLayer('work to do.', 92, 313, 136, 'italic', '#c8d2e8'),
  await textLayer('Hardware, dictation, and hosted inference.', 68, 554, 22, 'sans', muted),
])

const controller = await sharp(product).resize({ width: 625 }).png().toBuffer()
await saveCard('open-micro', [
  { input: glow(canvas, '#4b72da', 89, 65), left: 0, top: 0 },
  { input: controller, left: 560, top: 174 },
  ...header,
  await textLayer('Open Micro', 64, 181, 105, 'serif', '#141619'),
  await textLayer('A shortcut you can put\nyour hand on.', 69, 330, 31, 'sans', '#414853'),
  await textLayer('A concept in development.', 69, 552, 21, 'sans', '#414853'),
])

const lens = await sharp(asset('public/products/inference/token-lens.svg'))
  .resize({ width: 740, height: 550, fit: 'cover' }).png().toBuffer()
await saveCard('inference', [
  { input: glow(graphite, '#183681'), left: 0, top: 0 },
  { input: lens, left: 460, top: 80 },
  ...header,
  await textLayer('1,000 TPS', 64, 181, 126),
  await textLayer('Spend less time\nwaiting for output.', 69, 340, 36, 'serif', '#c8d2e8'),
  await textLayer('GLM-5.3-Flash · Throughput target, not a measured result.', 69, 554, 21, 'sans', muted),
])

const dictation = await sharp(asset('public/products/lavtype/voice-to-text.svg'))
  .resize({ width: 510, height: 490, fit: 'inside' }).png().toBuffer()
await saveCard('lavtype', [
  { input: glow(graphite, '#173b89'), left: 0, top: 0 },
  { input: dictation, left: 660, top: 112 },
  ...header,
  await textLayer('Lavtype', 64, 179, 140),
  await textLayer('Say what you were\ngoing to type.', 69, 351, 39, 'serif', '#c8d2e8'),
  await textLayer('Local dictation for macOS and X11 Linux.', 69, 554, 21, 'sans', muted),
])
