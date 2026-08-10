import {
  getSiteManifest,
  type SiteManifest,
} from "./manifest.ts"

export function getCloneSite(siteId: string): SiteManifest | undefined {
  return getSiteManifest(siteId)
}
