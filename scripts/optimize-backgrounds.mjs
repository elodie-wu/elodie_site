/** Generate versioned WebP assets without modifying the original PNGs. */
import { createHash } from 'node:crypto'
import { writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sources = [
  'assets/home/home-bg.png',
  'assets/pages/work-bg-v2.png',
  'assets/pages/play-bg.png',
  'assets/pages/logs-bg-v2.png',
  'assets/pages/about-bg-v2.png',
]

for (const source of sources) {
  const original = path.resolve('public', source)
  const data = await sharp(original)
    .webp({ quality: 92, effort: 6, smartSubsample: true, preset: 'drawing' })
    .toBuffer()
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
  const output = source.replace(/\.png$/, `-${hash}.webp`)
  await writeFile(path.resolve('public', output), data)
  const { size } = await stat(original)
  console.log(`${output}: ${(data.length / 1024).toFixed(0)} KB (${(100 * (1 - data.length / size)).toFixed(1)}% smaller)`)
}

console.log('If names changed, update src/config/site.ts and the homepage preload in index.html.')
