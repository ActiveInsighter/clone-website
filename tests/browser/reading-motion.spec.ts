import { expect, test, type Page } from "@playwright/test"
import { build } from "esbuild"

const route = "/components/reading-motion"
let fixtureJS = "", fixtureCSS = ""
test.beforeAll(async () => {
  const result = await build({ entryPoints: ["tests/fixtures/reading-motion.tsx"], bundle: true, write: false, outdir: "/tmp/reading-motion-fixture", loader: { ".css": "local-css" }, jsx: "automatic", define: { "process.env.NODE_ENV": '"development"' } })
  fixtureJS = result.outputFiles!.find(file => file.path.endsWith(".js"))!.text
  fixtureCSS = result.outputFiles!.find(file => file.path.endsWith(".css"))!.text
})

async function fixture(page: Page) {
  await page.goto("about:blank")
  await page.setContent('<html><head></head><body><div id="root"></div></body></html>')
  await page.addStyleTag({ content: `${fixtureCSS}\nbody{font:20px/1.8 Georgia;margin:20px}nav{display:flex;gap:8px}.fixture-article{width:300px;margin:24px 0}.fixture-space{height:340px}#nested-root{height:200px;overflow:auto;border:1px solid;padding:12px;width:320px}p{margin:0 0 24px}` })
  await page.addScriptTag({ content: fixtureJS })
  await expect(page.locator("#fixture-manual")).toBeVisible()
}

async function fillScales(page: Page, selector: string) {
  return page.locator(`${selector} [data-motion-line]`).evaluateAll(lines => lines.map(line => new DOMMatrix(getComputedStyle(line).transform).a))
}

test("manual selection follows wrapped rich text, replays and clears without changing the text", async ({ page }) => {
  await page.goto(route)
  await page.getByRole("tab", { name: "阅读理解", exact: true }).click()
  const sentence = page.locator("#evidence-two")
  await expect(sentence).toHaveAttribute("data-state", "idle")
  const original = await sentence.textContent()
  await page.getByRole("button", { name: "查看解析" }).nth(1).click()
  await expect(sentence).toHaveAttribute("data-state", "playing")
  await expect(sentence).toHaveAttribute("data-state", "complete")
  expect(await sentence.textContent()).toBe(original)
  expect((await fillScales(page, "#evidence-two")).every(value => value === 1)).toBe(true)
  await page.getByRole("button", { name: "重播关键句" }).click()
  await expect(sentence).toHaveAttribute("data-state", "playing")
  await page.getByRole("button", { name: "查看解析" }).first().click()
  await expect(sentence).toHaveAttribute("data-state", "idle")
  await page.getByRole("button", { name: "收起解析与高亮" }).click()
  await expect(page.locator("#evidence-one")).toHaveAttribute("data-state", "idle")
})

test("phone layout measures lines and stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(route)
  const selection = page.locator('[data-reading-motion="highlight"]').first()
  await selection.scrollIntoViewIfNeeded()
  await expect(selection).toHaveAttribute("data-state", "complete")
  expect(await selection.locator("[data-motion-line]").count()).toBeGreaterThan(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.getByRole("tab", { name: "阅读理解", exact: true }).click()
  await page.getByRole("button", { name: "查看解析" }).nth(2).click()
  const evidence = page.locator("#evidence-three")
  await expect(evidence).toHaveAttribute("data-state", "complete")
  expect(await evidence.locator("[data-motion-line]").count()).toBeGreaterThan(1)
  const bounds = await evidence.boundingBox()
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.y).toBeLessThan(844)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test("blog scroll motion reverses and paragraph ends in its natural position", async ({ page }) => {
  await page.goto(route)
  await page.getByRole("tab", { name: "博客文章", exact: true }).click()
  const highlight = page.locator('[data-reading-motion="highlight"]').first()
  const top = await highlight.evaluate(e => e.getBoundingClientRect().top + scrollY)
  await page.evaluate(y => scrollTo(0, y), top - 250)
  await expect(highlight).toHaveAttribute("data-state", "complete")
  await page.evaluate(y => scrollTo(0, y - innerHeight), top)
  await expect.poll(async () => (await fillScales(page, '[data-reading-motion="highlight"]')).some(value => value < 0.1)).toBe(true)
  const paragraph = page.locator('[data-reading-motion="paragraph"]')
  await paragraph.scrollIntoViewIfNeeded()
  await expect(paragraph).toHaveAttribute("data-state", "complete")
  await expect(paragraph.locator("[data-motion-text]")).toHaveCSS("transform", "none")
})

test("imperative controls, content remeasurement and StrictMode remount are reliable", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await fixture(page)
  const sentence = page.locator("#fixture-manual")
  const text = await sentence.textContent()
  await page.getByRole("button", { name: "play", exact: true }).click()
  await expect(sentence).toHaveAttribute("data-state", "playing")
  await page.getByRole("button", { name: "reset", exact: true }).click()
  await expect(sentence).toHaveAttribute("data-state", "idle")
  expect(await page.evaluate(() => window.motionFixture.progress)).toBe(0)
  await page.waitForTimeout(700)
  await expect(sentence).toHaveAttribute("data-state", "idle")
  await page.getByRole("button", { name: "finish", exact: true }).click()
  expect((await fillScales(page, "#fixture-manual")).every(value => value === 1)).toBe(true)
  expect(await sentence.textContent()).toBe(text)
  expect(await page.evaluate(() => window.motionFixture.completed)).toBe(1)
  await page.getByRole("button", { name: "edit", exact: true }).click()
  await expect(sentence.locator("[data-motion-line]")).toHaveCount(1)
  expect((await fillScales(page, "#fixture-manual"))[0]).toBe(1)
  await page.getByRole("button", { name: "mount", exact: true }).click()
  await expect(sentence).toHaveCount(0)
  await page.getByRole("button", { name: "mount", exact: true }).click()
  await page.getByRole("button", { name: "play", exact: true }).click()
  await expect(sentence).toHaveAttribute("data-state", "complete")
  expect(await page.evaluate(() => window.motionFixture.completed)).toBe(2)
  expect(errors).toEqual([])
})

test("nested scrolling drives progress and preserves reversible highlight", async ({ page }) => {
  await fixture(page)
  const root = page.locator("#nested-root")
  const sentence = page.locator("#fixture-nested")
  await root.scrollIntoViewIfNeeded()
  expect((await fillScales(page, "#fixture-nested")).every(value => value === 0)).toBe(true)
  await root.evaluate(e => { e.scrollTop = 400 })
  await expect(sentence).toHaveAttribute("data-state", "complete")
  expect((await fillScales(page, "#fixture-nested")).every(value => value === 1)).toBe(true)
  await root.evaluate(e => { e.scrollTop = 0 })
  await expect(sentence).toHaveAttribute("data-state", "idle")
})

test("reduced motion finishes immediately and RTL lines fill from the right", async ({ page }) => {
  await fixture(page)
  await page.getByRole("button", { name: "rtl", exact: true }).click()
  await page.getByRole("button", { name: "play", exact: true }).click()
  await expect(page.locator("#fixture-manual")).toHaveAttribute("data-state", "playing")
  const origins = await page.locator("#fixture-manual [data-motion-line]").evaluateAll(lines => lines.map(e => getComputedStyle(e).transformOrigin))
  expect(origins.every(origin => !origin.startsWith("0px"))).toBe(true)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator("#fixture-manual")).toHaveAttribute("data-state", "complete")
  await expect(page.locator("#fixture-manual [data-motion-cursor]")).toHaveCSS("display", "none")
  await page.getByRole("button", { name: "move", exact: true }).click()
  await expect(page.locator("#fixture-paragraph")).toHaveAttribute("data-state", "complete")
  await expect(page.locator("#fixture-paragraph [data-motion-text]")).toHaveCSS("transform", "none")
  expect(await page.evaluate(() => window.motionFixture.completed)).toBe(1)
})

test("zero translation still rotates, and keyboard links finish motion safely", async ({ page }) => {
  await fixture(page)
  await page.getByRole("button", { name: "move", exact: true }).click()
  await expect.poll(() => page.locator("#fixture-paragraph [data-motion-text]").evaluate(e => getComputedStyle(e).transform)).not.toBe("none")
  await page.getByRole("button", { name: "play", exact: true }).click()
  await page.getByRole("link", { name: "An accessible link" }).focus()
  await expect(page.locator("#fixture-manual")).toHaveAttribute("data-state", "complete")
  await expect(page.locator("#fixture-manual [data-motion-cursor]")).toHaveCSS("opacity", "0")
})

test("automatic positioning settles before a distant sentence is selected", async ({ page }) => {
  await fixture(page)
  await page.getByRole("button", { name: "scrollplay", exact: true }).click()
  await page.waitForTimeout(100)
  expect(await page.evaluate(() => window.motionFixture.farProgress)).toBe(0)
  const target = page.locator("#fixture-far")
  await expect(target).toHaveAttribute("data-state", "playing")
  const y = await page.evaluate(() => scrollY)
  await page.waitForTimeout(100)
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(1)
  await expect(target).toHaveAttribute("data-state", "complete")
})
