export type LegacySite = "chatgpt" | "studio"

const chatGptPathPrefixes = [
  "/c",
  "/g",
  "/library",
  "/scheduled",
  "/plugins",
] as const

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function getLegacySiteForPathname(pathname: string): LegacySite {
  if (chatGptPathPrefixes.some((prefix) => matchesPathPrefix(pathname, prefix))) {
    return "chatgpt"
  }

  return "studio"
}
