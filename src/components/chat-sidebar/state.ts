export type SidebarShortcutEvent = Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey">

export function readSidebarCookieState(
  cookieHeader: string,
  cookieName: string,
): boolean | undefined {
  for (const segment of cookieHeader.split(";")) {
    const separatorIndex = segment.indexOf("=")
    if (separatorIndex < 0) continue

    const name = segment.slice(0, separatorIndex).trim()
    if (name !== cookieName) continue

    const rawValue = segment.slice(separatorIndex + 1).trim()
    let value = rawValue
    try {
      value = decodeURIComponent(rawValue)
    } catch {
      value = rawValue
    }

    if (value === "true") return true
    if (value === "false") return false
    return undefined
  }

  return undefined
}

export function serializeSidebarCookie(
  cookieName: string,
  open: boolean,
  maxAge: number,
): string {
  return `${cookieName}=${open}; path=/; max-age=${maxAge}`
}

export function matchesSidebarShortcut(
  event: SidebarShortcutEvent,
  shortcut: string,
): boolean {
  return (
    event.key.toLocaleLowerCase() === shortcut.toLocaleLowerCase() &&
    (event.ctrlKey || event.metaKey)
  )
}
