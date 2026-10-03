// Capture original fonts and artworks through a real browser with stable filenames.
const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const key = 'www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446'
const assets = path.join(root, 'public/sites', key)
const research = path.join(root, 'docs/research', key)
const shots = path.join(root, 'docs/design-references', key)
const textures = {
  a06ccc910a8ee460345ff4f0c46d99a17af7f9bd: 'images/hero-0.webp',
  a63576fc5e4af0139e2eb432b9a6316f16348d7c: 'images/hero-1.webp',
  b7b0d617a1d7a573197f480122d6e500bc78e633: 'images/hero-middle.webp',
}

async function download() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
    ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const jobs = []
    const manifest = []
    const seen = new Set()
    page.on('response', response => {
      const url = response.url()
      let rel
      if (url.includes('.woff2')) {
        rel = 'fonts/' + url.split('/').pop().split('_Web')[0].split('_VF')[0] + '.woff2'
      } else if (url.includes('favicon-32x32')) rel = 'favicon.png'
      else rel = Object.entries(textures).find(([hash]) => url.includes(hash))?.[1]
      if (!rel || response.status() !== 200 || seen.has(rel)) return
      seen.add(rel)
      jobs.push((async () => {
        const body = await response.body()
        const dest = path.join(assets, rel)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, body)
        manifest.push({ url, path: path.relative(root, dest), bytes: body.length })
      })())
    })
    await page.goto('https://www.anthropic.com/claude-opus-5-5', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.locator('.stage.ready').waitFor({ timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    for (const y of [0, 300, 900]) {
      await page.evaluate(y => scrollTo(0, y), y)
      await page.waitForTimeout(800)
      await page.screenshot({ path: path.join(shots, 'hero-hydrated-scroll-' + y + '.png') })
    }
    // Procedural rendering does not request the original middle photo itself.
    const settings = JSON.parse(fs.readFileSync(path.join(research, 'hero-settings.json'), 'utf8'))
    const response = await page.goto(settings.middle.src, { waitUntil: 'load' })
    if (!response || response.status() !== 200) throw new Error('Middle artwork download failed')
    await response.body()
    await Promise.all(jobs)
    for (const rel of Object.values(textures)) {
      if (!seen.has(rel)) throw new Error('Missing required hero texture: ' + rel)
    }
    manifest.sort((a, b) => a.path.localeCompare(b.path))
    fs.writeFileSync(path.join(research, 'asset-manifest.json'), JSON.stringify(manifest, null, 2))
    console.log('Downloaded ' + manifest.length + ' assets with deterministic filenames')
  } finally { await browser.close() }
}

download().catch(error => { console.error(error); process.exitCode = 1 })
