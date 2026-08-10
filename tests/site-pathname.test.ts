import assert from "node:assert/strict"
import test from "node:test"

import { getSitePathname } from "../src/sites/pathname.ts"

test("removes only the owning clone prefix from nested site paths", () => {
  assert.equal(getSitePathname("/clones/chatgpt/c/chat-12", "chatgpt"), "/c/chat-12")
  assert.equal(getSitePathname("/clones/studio/database/tables", "studio"), "/database/tables")
  assert.equal(getSitePathname("/clones/openai", "openai"), "/")
})

test("leaves paths from other sites untouched", () => {
  assert.equal(getSitePathname("/clones/studio/database", "chatgpt"), "/clones/studio/database")
})
