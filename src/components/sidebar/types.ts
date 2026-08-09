import type * as React from "react"

export type SidebarSide = "left" | "right"

export type SidebarSurface = "panel" | "rail" | "external"

export type SidebarCookieOptions = {
  name: string
  maxAge?: number
  path?: string
  sameSite?: "lax" | "strict" | "none"
  secure?: boolean
}

export type SidebarRootState = "expanded" | "collapsed"

export type SidebarPublicContextValue = {
  state: SidebarRootState
  open: boolean
  mobileOpen: boolean
  isMobile: boolean
  modifierHeld: boolean
  setOpen: (open: boolean) => void
  setMobileOpen: (open: boolean) => void
  toggle: () => void
}

export type SidebarRootProps = Omit<React.ComponentPropsWithoutRef<"div">, "style"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  mobileOpen?: boolean
  defaultMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  shortcutKey?: string | null
  persistence?: SidebarCookieOptions | false
  tokens?: SidebarTokenOverrides
  style?: SidebarStyle
}

export type SidebarTokenName =
  | "--sidebar-width"
  | "--sidebar-rail-width"
  | "--sidebar-header-height"
  | "--sidebar-item-height"
  | "--sidebar-icon-button-size"
  | "--sidebar-icon-size"
  | "--sidebar-action-size"
  | "--sidebar-inline-margin"
  | "--sidebar-inline-padding"
  | "--sidebar-item-radius"
  | "--sidebar-section-gap"
  | "--sidebar-font-size"
  | "--sidebar-motion-duration"
  | "--sidebar-motion-fast-duration"
  | "--sidebar-motion-easing"
  | "--sidebar-surface"
  | "--sidebar-foreground"
  | "--sidebar-muted-foreground"
  | "--sidebar-row-highlight"
  | "--sidebar-border"
  | "--sidebar-border-strong"
  | "--sidebar-focus-ring"
  | "--sidebar-overlay"
  | "--sidebar-shadow"

export type SidebarTokenOverrides = Partial<Record<SidebarTokenName, string>>

export type SidebarStyle = React.CSSProperties & SidebarTokenOverrides

export type SidebarShellProps = Omit<React.ComponentPropsWithoutRef<"aside">, "children"> & {
  side?: SidebarSide
  label: string
  rail: React.ReactNode
  children: React.ReactNode
  overlayClassName?: string
  popupClassName?: string
}
