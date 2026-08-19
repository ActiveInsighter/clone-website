import assert from "node:assert/strict"
import test from "node:test"

import { getSiteManifest, siteManifests } from "../src/sites/manifest.ts"
import { getCloneSite } from "../src/sites/registry.ts"

test("lists exactly the supported clone sites", () => {
  assert.deepEqual(Object.keys(siteManifests), ["openai", "chatgpt", "studio", "gemini", "pocketbase"])
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
  assert.equal(siteManifests.pocketbase.navigation.surface, "studio-app-shell")
  assert.equal(
    siteManifests.pocketbase.navigation.owner,
    "src/components/pocketbase-app-shell.tsx",
  )
})

test("returns no manifest for an unknown site id", () => {
  assert.equal(getSiteManifest("unknown"), undefined)
})

test("resolves every supported clone through the site registry", () => {
  assert.equal(getCloneSite("openai")?.id, "openai")
  assert.equal(getCloneSite("chatgpt")?.id, "chatgpt")
  assert.equal(getCloneSite("studio")?.id, "studio")
  assert.equal(getCloneSite("gemini")?.id, "gemini")
  assert.equal(getCloneSite("pocketbase")?.id, "pocketbase")
})
