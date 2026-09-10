import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, 'source')
const publicDir = join(here, '..', 'public')

const jobs = [
  ['icon-only.svg', 'icon-only.png'],
  ['icon-foreground.svg', 'icon-foreground.png'],
  ['icon-background.svg', 'icon-background.png'],
  ['splash.svg', 'splash.png'],
  ['splash-dark.svg', 'splash-dark.png']
]

for (const [from, to] of jobs) {
  await sharp(join(src, from)).png().toFile(join(here, to))
  console.log('rendered', to)
}

const pwaIcons = [
  ['icon-only.svg', 'pwa-192.png', 192],
  ['icon-only.svg', 'pwa-512.png', 512],
  ['icon-maskable.svg', 'pwa-maskable-512.png', 512]
]

for (const [from, to, size] of pwaIcons) {
  await sharp(join(src, from)).resize(size, size).png().toFile(join(publicDir, to))
  console.log('rendered', to)
}
