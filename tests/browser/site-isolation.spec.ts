import { expect, test } from "@playwright/test"

test("client navigation keeps clone styles and sidebar destinations isolated", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/clones")
  await page.getByRole("link", { name: /Gemini/ }).click()
  await expect(page.locator(".gemini-page")).toHaveCSS("background-color", "rgb(15, 15, 15)")
  await expect(page.getByRole("link", { name: "库", exact: true })).toHaveAttribute("href", "/clones/gemini/library")
  await page.goBack()
  await page.getByRole("link", { name: /ChatGPT/ }).click()
  await expect(page.locator("[data-clone-site]")).toHaveAttribute("data-clone-site", "chatgpt")
  const library = page.getByRole("link", { name: "文件库", exact: true })
  await expect(library).toHaveAttribute("href", "/clones/chatgpt/library")
  await library.click()
  await expect(page).toHaveURL(/\/clones\/chatgpt\/library$/)
  await expect(library).toHaveAttribute("aria-current", "page")
  await page.goto("/clones")
  await page.getByRole("link", { name: /Studio/ }).click()
  const shell = page.locator(".studio-shell")
  await expect(shell).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await page.getByRole("link", { name: "Database", exact: true }).click()
  await expect(page).toHaveURL(/\/clones\/studio\/database$/)
  await expect(page.locator(".studio-flow-table")).toBeVisible()
  await page.getByRole("button", { name: "Switch to light mode" }).click()
  await expect(shell).toHaveCSS("background-color", "rgb(247, 248, 250)")
  expect(await page.locator("body").evaluate(element => getComputedStyle(element).getPropertyValue("--studio-bg"))).toBe("")
  expect(errors).toEqual([])
})

test("mobile clone routes load without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ["openai", "chatgpt", "gemini", "studio"]) {
    await page.goto(`/clones/${path}`)
    await expect(page.locator("[data-clone-site]")).toHaveAttribute("data-clone-site", path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})


test("mobile overlays inherit their site's palette and remain within that site", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/clones/studio")
  await page.getByRole("button", { name: "Open navigation", exact: true }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await expect(dialog).toHaveCSS("background-color", await page.locator(".studio-shell aside").first().evaluate(element => getComputedStyle(element).backgroundColor))
  expect(await dialog.evaluate(element => element.closest('[data-clone-site="studio"]') !== null)).toBe(true)
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await page.goto("/clones/gemini")
  await page.getByRole("button", { name: "打开边栏", exact: true }).click()
  const sidebar = page.getByRole("dialog")
  expect(await sidebar.evaluate(element => element.closest('[data-clone-site="gemini"]') !== null)).toBe(true)
  await expect(sidebar.locator(".configured-sidebar-brand")).toHaveCSS("font-size", "17px")
})
