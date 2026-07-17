import { mkdir } from 'node:fs/promises'
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

await sharp(socialMaster.input)
  .extract(socialMaster.crop)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile('public/open-micro-social.png')

console.log('Optimized Open Micro product imagery.')
