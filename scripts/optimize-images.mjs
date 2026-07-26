import { mkdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'

const fullFrame = { left: 0, top: 0, width: 2048, height: 2048 }
const masters = {
  hero: {
    input: 'artwork/masters/open-micro-hero-master.png',
    crop: { left: 128, top: 320, width: 1664, height: 1664 },
  },
  exploded: {
    input: 'artwork/masters/open-micro-exploded-master.png',
    crop: { left: 144, top: 288, width: 1760, height: 1760 },
  },
  rear: { input: 'artwork/masters/open-micro-rear-master.png', crop: fullFrame },
  top: { input: 'artwork/masters/open-micro-top-master.png', crop: fullFrame },
}
const socialMaster = masters.hero
const widths = [1536, 1024, 640]
const outputDirectory = 'src/assets/product/generated'
const drawingSources = {
  top: { input: 'src/assets/product/source/top.svg', scale: 0.72 },
  exploded: { input: 'src/assets/product/source/exploded.svg', scale: 0.78 },
  enclosure: { input: 'src/assets/product/source/silver-anodized.svg', scale: 0.78 },
}
const drawingWidths = [1024, 640]
const drawingBackground = '#eae4d9'
const drawingInk = '#172033'
const drawingSecondaryInk = '#59616d'

async function createEditorialDrawing(name, drawing, width) {
  const source = (await readFile(drawing.input, 'utf8'))
    .replaceAll('rgb(0,0,0)', drawingInk)
    .replaceAll('rgb(160,160,160)', drawingSecondaryInk)
  const drawingSize = Math.round(width * drawing.scale)
  const renderedDrawing = await sharp(Buffer.from(source), { density: 360 })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize({
      width: drawingSize,
      height: drawingSize,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer()
  const plate = sharp({
    create: {
      width,
      height: width,
      channels: 4,
      background: drawingBackground,
    },
  }).composite([{ input: renderedDrawing, gravity: 'centre' }])

  await Promise.all([
    plate.clone().avif({ quality: 76, effort: 6, chromaSubsampling: '4:4:4' })
      .toFile(`${outputDirectory}/drawing-${name}-${width}.avif`),
    plate.clone().webp({ quality: 88, smartSubsample: true })
      .toFile(`${outputDirectory}/drawing-${name}-${width}.webp`),
  ])
}

await mkdir(outputDirectory, { recursive: true })
await mkdir('public', { recursive: true })

await Promise.all(
  Object.entries(masters).flatMap(([name, master]) =>
    widths.flatMap((width) => [
      sharp(master.input)
        .extract(master.crop)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 70, effort: 6, chromaSubsampling: '4:4:4' })
        .toFile(`${outputDirectory}/${name}-${width}.avif`),
      sharp(master.input)
        .extract(master.crop)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 86, smartSubsample: true })
        .toFile(`${outputDirectory}/${name}-${width}.webp`),
    ]),
  ),
)

await Promise.all(
  Object.entries(drawingSources).flatMap(([name, drawing]) =>
    drawingWidths.map((width) => createEditorialDrawing(name, drawing, width)),
  ),
)

await sharp(socialMaster.input)
  .extract(socialMaster.crop)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile('public/open-micro-social.png')

console.log('Optimized Open Micro product imagery and editorial drawings.')
