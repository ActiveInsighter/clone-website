export type { SiteId, SiteManifest, ClonePickerItem, NavigationSurface } from "./types"
import type { SiteId, SiteManifest, ClonePickerItem } from "./types"
import { openaiManifest } from "./openai/manifest.ts"
import { chatgptManifest } from "./chatgpt/manifest.ts"
import { studioManifest } from "./studio/manifest.ts"
import { geminiManifest } from "./gemini/manifest.ts"
import { anthropicManifest } from "./anthropic/manifest.ts"

export const siteManifests = {
  openai: openaiManifest,
  chatgpt: chatgptManifest,
  studio: studioManifest,
  gemini: geminiManifest,
  anthropic: anthropicManifest,
} as const satisfies Record<SiteId, SiteManifest>

export function getSiteManifest(siteId: string): SiteManifest | undefined {
  if (!Object.hasOwn(siteManifests, siteId)) return undefined

  return siteManifests[siteId as SiteId]
}

// Every supported source path is declared by its owning site and exported at build time.
export function getStaticCloneParams(): { siteId: SiteId; path: string[] }[] {
  return Object.values(siteManifests).flatMap(({ id, paths }) =>
    paths.map((path) => ({ siteId: id, path: path.split("/").filter(Boolean) })),
  )
}

export function getCloneRoute(siteId: string, path: readonly string[] = []): SiteManifest | undefined {
  const site = getSiteManifest(siteId)
  const sourcePath = `/${path.join("/")}`
  return site?.paths.includes(sourcePath) ? site : undefined
}

export function getClonePickerItems(): readonly ClonePickerItem[] {
  return Object.values(siteManifests).map((manifest) => ({
    id: manifest.id,
    label: manifest.label,
    href: manifest.defaultPath,
  }))
}
