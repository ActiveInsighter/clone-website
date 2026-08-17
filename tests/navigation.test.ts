import assert from "node:assert/strict"
import test from "node:test"

import {
  resolveNavigationHref,
  stripNavigationBasePath,
} from "../src/lib/navigation.ts"

test("strips a clone base path before active-route matching", () => {
  assert.equal(stripNavigationBasePath("/clones/studio", "/clones/studio"), "/")
  assert.equal(stripNavigationBasePath("/clones/studio/database/tables", "/clones/studio"), "/database/tables")
  assert.equal(stripNavigationBasePath("/clones/chatgpt", "/clones/studio"), "/clones/chatgpt")
})

test("resolves internal navigation links inside the clone base path", () => {
  assert.equal(resolveNavigationHref("/", "/clones/studio"), "/clones/studio")
  assert.equal(resolveNavigationHref("/database", "/clones/studio"), "/clones/studio/database")
  assert.equal(resolveNavigationHref("database/tables", "/clones/studio/"), "/clones/studio/database/tables")
})

test("leaves external and fragment links untouched", () => {
  assert.equal(resolveNavigationHref("https://supabase.com", "/clones/studio"), "https://supabase.com")
  assert.equal(resolveNavigationHref("#details", "/clones/studio"), "#details")
})
