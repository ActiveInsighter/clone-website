import assert from "node:assert/strict"
import test from "node:test"

import { getSiteManifest, getStaticCloneParams, getCloneRoute, siteManifests } from "../src/sites/manifest.ts"
import { getCloneSite } from "../src/sites/registry.ts"

test("lists exactly the supported clone sites", () => {
  assert.deepEqual(Object.keys(siteManifests), ["openai", "chatgpt", "studio", "gemini", "anthropic"])
})

test("keeps each clone attached to its correct navigation surface", () => {
  assert.equal(siteManifests.openai.navigation.surface, "marketing-top-nav")
  assert.equal(
    siteManifests.openai.navigation.owner,
    "src/components/openai-navigation/responsive-navigation.tsx",
  )
  assert.equal(siteManifests.chatgpt.navigation.surface, "chatgpt-compound-sidebar")
  assert.equal(siteManifests.chatgpt.navigation.owner, "src/components/sidebar/")
  assert.equal(siteManifests.studio.navigation.surface, "studio-app-shell")
  assert.equal(siteManifests.studio.navigation.owner, "src/components/studio-app-shell/")
  assert.equal(siteManifests.gemini.navigation.surface, "gemini-sidebar")
  assert.equal(siteManifests.gemini.navigation.owner, "src/components/sidebar/configured-sidebar.tsx")
  assert.equal(siteManifests.anthropic.navigation.surface, "editorial-top-nav")
})

test("returns no manifest for an unknown site id", () => {
  assert.equal(getSiteManifest("unknown"), undefined)
  assert.equal(getSiteManifest("toString"), undefined)
  assert.equal(getSiteManifest("__proto__"), undefined)
})

test("resolves every supported clone through the site registry", () => {
  assert.equal(getCloneSite("openai")?.id, "openai")
  assert.equal(getCloneSite("chatgpt")?.id, "chatgpt")
  assert.equal(getCloneSite("studio")?.id, "studio")
  assert.equal(getCloneSite("gemini")?.id, "gemini")
  assert.equal(getCloneSite("anthropic")?.id, "anthropic")
})

test("preserves source pathnames when generating clone pages", () => {
  const params = getStaticCloneParams()
  assert.deepEqual(params.find(({ siteId }) => siteId === "anthropic"), {
    siteId: "anthropic",
    path: ["claude-opus-5-5"],
  })
  for (const id of ["openai", "chatgpt", "studio", "gemini"]) {
    assert.deepEqual(params.find(({ siteId }) => siteId === id)?.path, [])
  }
  assert.equal(new Set(params.map(({ siteId, path }) => `${siteId}/${path.join("/")}`)).size, params.length)
})


test("exports known nested clone routes and rejects paths belonging to another site", () => {
  const paths = getStaticCloneParams().map(({ siteId, path }) => `/clones/${siteId}${path.length ? `/${path.join("/")}` : ""}`)
  for (const path of ["/clones/chatgpt/library", "/clones/chatgpt/c/chat-1", "/clones/studio/database", "/clones/studio/settings", "/clones/gemini/search", "/clones/gemini/notebooks/create"]) {
    assert.ok(paths.includes(path), `Missing production route: ${path}`)
  }
  assert.equal(getCloneRoute("anthropic", ["claude-opus-5-5"])?.id, "anthropic")
  assert.equal(getCloneRoute("openai", ["claude-opus-5-5"]), undefined)
  assert.equal(getCloneRoute("studio", ["does-not-exist"]), undefined)
  assert.equal(getCloneRoute("unknown", []), undefined)
})
