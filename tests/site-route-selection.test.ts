import assert from "node:assert/strict"
import test from "node:test"

import { getLegacySiteForPathname } from "../src/sites/legacy-route-selection.ts"

test("keeps ChatGPT deep links inside the ChatGPT clone", () => {
  for (const pathname of [
    "/c/chat-12",
    "/g/project-codex/project",
    "/library",
    "/scheduled",
    "/plugins",
  ]) {
    assert.equal(getLegacySiteForPathname(pathname), "chatgpt")
  }
})

test("keeps Studio navigation paths inside the Studio clone", () => {
  for (const pathname of [
    "/dashboard",
    "/database",
    "/database/tables",
    "/settings",
  ]) {
    assert.equal(getLegacySiteForPathname(pathname), "studio")
  }
})
