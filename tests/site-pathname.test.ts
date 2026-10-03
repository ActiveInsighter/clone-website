import assert from "node:assert/strict"
import test from "node:test"

import { getSitePathname, getCloneHref } from "../src/sites/pathname.ts"

test("removes only the owning clone prefix from nested site paths", () => {
  assert.equal(getSitePathname("/clones/chatgpt/c/chat-12", "chatgpt"), "/c/chat-12")
  assert.equal(getSitePathname("/clones/studio/database/tables", "studio"), "/database/tables")
  assert.equal(getSitePathname("/clones/openai", "openai"), "/")
})

test("leaves paths from other sites untouched", () => {
  assert.equal(getSitePathname("/clones/studio/database", "chatgpt"), "/clones/studio/database")
})


test("keeps source links inside the owning clone while preserving query strings and fragments", () => {
  assert.equal(getCloneHref("chatgpt", "/"), "/clones/chatgpt")
  assert.equal(getCloneHref("chatgpt", "/c/chat-1"), "/clones/chatgpt/c/chat-1")
  assert.equal(getCloneHref("gemini", "/library?view=all#recent"), "/clones/gemini/library?view=all#recent")
  assert.equal(getCloneHref("studio", "/database"), "/clones/studio/database")
})
