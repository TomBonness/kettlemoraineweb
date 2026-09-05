import { mkdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'

const fullFrame = { left: 0, top: 0, width: 2048, height: 2048 }
const masters = {
  hero: {
    input: 'artwork/masters/open-micro-hero-master.png',
  },
  exploded: {
    input: 'artwork/masters/open-micro-exploded-master.png',
  },
  rear: { input: 'artwork/masters/open-micro-rear-master.png', crop: fullFrame },
  top: { input: 'artwork/masters/open-micro-top-master.png', crop: fullFrame },
}
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

function resizeMaster(master, width) {
  const image = sharp(master.input)
  if (master.crop) image.extract(master.crop)
  return image.resize({ width, withoutEnlargement: true })
}

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

await Promise.all(
  Object.entries(masters).flatMap(([name, master]) =>
    widths.flatMap((width) => [
      resizeMaster(master, width)
        .avif({ quality: 70, effort: 6, chromaSubsampling: '4:4:4' })
        .toFile(`${outputDirectory}/${name}-${width}.avif`),
      resizeMaster(master, width)
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

console.log('Optimized Open Micro product imagery, Blender renders, and editorial drawings.')
