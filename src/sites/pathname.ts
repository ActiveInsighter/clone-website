import type { SiteId } from "./manifest"

export function getSitePathname(pathname: string, siteId: SiteId): string {
  const prefix = `/clones/${siteId}`

  if (pathname === prefix) return "/"
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length)

  return pathname
}

/** Convert a source-site path to a link owned by this clone. */
export function getCloneHref(siteId: SiteId, sourcePath: string = "/"): string {
  return `/clones/${siteId}${sourcePath === "/" ? "" : sourcePath}`
}
