import assert from "node:assert/strict"
import test from "node:test"

import { geminiSidebarConfig } from "../src/components/gemini-sidebar-data.ts"
import { getSiteManifest, siteManifests } from "../src/sites/manifest.ts"

test("registers Gemini as a clone with a reusable sidebar surface", () => {
  assert.equal(Object.keys(siteManifests).includes("gemini"), true)
  assert.equal(getSiteManifest("gemini")?.navigation.surface, "gemini-sidebar")
  assert.equal(getSiteManifest("gemini")?.defaultPath, "/clones/gemini")
})

test("describes Gemini navigation as data instead of page-specific markup", () => {
  assert.equal(geminiSidebarConfig.primaryItems.map((item) => item.label).join(" / "), "发起新对话 / 搜索对话内容")
  assert.equal(geminiSidebarConfig.secondaryItems[0]?.label, "库")
  assert.deepEqual(
    geminiSidebarConfig.sections.map((section) => section.label),
    ["笔记本", "最近"],
  )
  assert.ok((geminiSidebarConfig.sections[1]?.items.length ?? 0) >= 8)
})
