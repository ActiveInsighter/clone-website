export type SidebarPersistenceOptions = {
  maxAge?: number
  path?: string
  sameSite?: "lax" | "strict" | "none"
  secure?: boolean
}

export type SidebarShortcutEvent = {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  repeat: boolean
  isComposing: boolean
  defaultPrevented: boolean
}

export type SidebarTargetDescriptor = {
  tagName?: string
  isContentEditable?: boolean
  hasEditableAncestor?: boolean
}

export type SidebarModifierState = {
  modifierHeld: boolean
  modifierKey: "control" | "meta" | null
}

export type SidebarModifierAction =
  | { type: "keyboard"; ctrlKey: boolean; metaKey: boolean }
  | { type: "window-blur" }
  | { type: "page-hide" }
  | { type: "visibility-hidden" }

export type SidebarPresentationState = {
  desktopOpen: boolean
  mobileOpen: boolean
}

export type SidebarPresentationAction =
  | { type: "set-desktop-open"; open: boolean }
  | { type: "set-mobile-open"; open: boolean }
  | { type: "toggle-desktop" }
  | { type: "toggle-mobile" }

const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

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
  options: SidebarPersistenceOptions = {},
): string {
  const maxAge = options.maxAge ?? DEFAULT_COOKIE_MAX_AGE
  const path = options.path ?? "/"
  const sameSite = options.sameSite ?? "lax"
  const parts = [
    `${cookieName}=${open}`,
    `path=${path}`,
    `max-age=${maxAge}`,
    `samesite=${sameSite}`,
  ]

  if (options.secure) parts.push("secure")
  return parts.join("; ")
}

export function matchesSidebarShortcut(
  event: Pick<SidebarShortcutEvent, "key" | "ctrlKey" | "metaKey">,
  shortcutKey: string,
): boolean {
  return (
    event.key.toLocaleLowerCase() === shortcutKey.toLocaleLowerCase() &&
    (event.ctrlKey || event.metaKey)
  )
}

export function isTextEntryTarget(target: SidebarTargetDescriptor): boolean {
  const tagName = target.tagName?.toLocaleLowerCase()
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable === true ||
    target.hasEditableAncestor === true
  )
}

export function shouldHandleSidebarShortcut(
  event: SidebarShortcutEvent,
  shortcutKey: string,
  target: SidebarTargetDescriptor,
): boolean {
  return (
    !event.altKey &&
    !event.repeat &&
    !event.isComposing &&
    !event.defaultPrevented &&
    !isTextEntryTarget(target) &&
    matchesSidebarShortcut(event, shortcutKey)
  )
}

export function reduceSidebarModifierState(
  state: SidebarModifierState,
  action: SidebarModifierAction,
): SidebarModifierState {
  if (action.type !== "keyboard") {
    return state.modifierHeld || state.modifierKey
      ? { modifierHeld: false, modifierKey: null }
      : state
  }

  const modifierHeld = action.ctrlKey || action.metaKey
  const modifierKey = action.metaKey
    ? "meta"
    : action.ctrlKey
      ? "control"
      : null
  return state.modifierHeld === modifierHeld && state.modifierKey === modifierKey
    ? state
    : { modifierHeld, modifierKey }
}

export function reduceSidebarPresentationState(
  state: SidebarPresentationState,
  action: SidebarPresentationAction,
): SidebarPresentationState {
  switch (action.type) {
    case "set-desktop-open":
      return state.desktopOpen === action.open
        ? state
        : { ...state, desktopOpen: action.open }
    case "set-mobile-open":
      return state.mobileOpen === action.open
        ? state
        : { ...state, mobileOpen: action.open }
    case "toggle-desktop":
      return { ...state, desktopOpen: !state.desktopOpen }
    case "toggle-mobile":
      return { ...state, mobileOpen: !state.mobileOpen }
  }
}

export function resolveSidebarFocusReturn<T extends { isConnected: boolean }>(
  opener: T | null,
  fallback: T | null,
): T | null {
  if (opener?.isConnected) return opener
  if (fallback?.isConnected) return fallback
  return null
}

export function getSidebarFocusHandoffSurface(
  open: boolean,
  activeSurface: "panel" | "rail" | null,
): "panel" | "rail" | null {
  if (open && activeSurface === "rail") return "panel"
  if (!open && activeSurface === "panel") return "rail"
  return null
}
