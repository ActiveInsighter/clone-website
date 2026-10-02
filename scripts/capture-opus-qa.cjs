// Run against a local server: CHROMIUM_PATH=/usr/bin/chromium node scripts/capture-opus-qa.cjs
const { chromium } = require("playwright")
const { mkdirSync } = require("node:fs")
const { join } = require("node:path")

const root = join(__dirname, "../docs/design-references/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446")
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3000"

async function capture() {
  mkdirSync(root, { recursive: true })
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] } : {}),
    headless: true,
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto(`${base}/clones/anthropic/claude-opus-5-5`)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: join(root, "clone-desktop.png"), fullPage: true })
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(350)
    await page.screenshot({ path: join(root, "clone-hero-scroll-300.png") })
    // Hide fixed navigation only for isolated component screenshots.
    await page.addStyleTag({ content: ".opus-header,.opus-reading-nav { visibility:hidden !important; }" })
    for (const [selector, name] of [[".evidence-benchmark", "benchmark"], [".opus-testimonials", "testimonial"], [".opus-responses", "responses"]]) {
      const element = page.locator(selector).first()
      await element.scrollIntoViewIfNeeded()
      await element.screenshot({ path: join(root, `clone-${name}.png`) })
    }
    const groups = page.locator(".opus-charts")
    for (let group = 0; group < await groups.count(); group++) {
      const charts = groups.nth(group)
      const tabs = charts.getByRole("tab")
      for (let tab = 0; tab < await tabs.count(); tab++) {
        await tabs.nth(tab).click()
        await charts.scrollIntoViewIfNeeded()
        await page.waitForTimeout(850)
        await charts.getByRole("tabpanel").screenshot({ path: join(root, `clone-chart-${group + 1}-${tab + 1}.png`) })
      }
    }
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${base}/clones/anthropic/claude-opus-5-5`)
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: join(root, `clone-${width}.png`), fullPage: true })
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${base}/components/evidence`)
    await page.screenshot({ path: join(root, "gallery-paper.png"), fullPage: true })
    await page.getByRole("button", { name: "Dark", exact: true }).click()
    await page.screenshot({ path: join(root, "gallery-dark.png"), fullPage: true })
    console.log(`Saved visual QA screenshots to ${root}`)
  } finally { await browser.close() }
}

capture().catch(error => { console.error(error); process.exitCode = 1 })
