import assert from "node:assert/strict"
import test from "node:test"

import { siteLoaders } from "../src/sites/loaders.ts"

test("provides exactly one lazy loader for every registered clone", () => {
  assert.deepEqual(Object.keys(siteLoaders), ["openai", "chatgpt", "studio"])
  assert.ok(Object.values(siteLoaders).every((loader) => typeof loader === "function"))
})
