import assert from "node:assert/strict"
import test from "node:test"

import { getClonePickerItems } from "../src/sites/manifest.ts"

test("builds one explicit selector link for every registered clone", () => {
  assert.deepEqual(
    getClonePickerItems().map(({ id, label, href }) => ({ id, label, href })),
    [
      { id: "openai", label: "OpenAI", href: "/clones/openai" },
      { id: "chatgpt", label: "ChatGPT", href: "/clones/chatgpt" },
      { id: "studio", label: "Studio", href: "/clones/studio" },
      { id: "gemini", label: "Gemini", href: "/clones/gemini" },
      { id: "pocketbase", label: "PocketBase Collections", href: "/clones/pocketbase" },
    ],
  )
})

test("keeps clone picker links unique and within the clone route namespace", () => {
  const items = getClonePickerItems()
  const hrefs = items.map((item) => item.href)

  assert.equal(new Set(hrefs).size, hrefs.length)
  assert.ok(hrefs.every((href) => href.startsWith("/clones/")))
})
