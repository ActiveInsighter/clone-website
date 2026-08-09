import type { SidebarStyle, SidebarTokenName, SidebarTokenOverrides } from "./types"

export const SIDEBAR_MOBILE_QUERY = "(max-width: 47.999rem)"

export const sidebarDefaultTokens = {
  "--sidebar-width": "16.25rem",
  "--sidebar-rail-width": "3.65625rem",
  "--sidebar-header-height": "3.65625rem",
  "--sidebar-item-height": "2.53125rem",
  "--sidebar-icon-button-size": "2.53125rem",
  "--sidebar-icon-size": "1.25rem",
  "--sidebar-action-size": "1.75rem",
  "--sidebar-inline-margin": "0.375rem",
  "--sidebar-inline-padding": "0.75rem",
  "--sidebar-item-radius": "0.625rem",
  "--sidebar-section-gap": "1.125rem",
  "--sidebar-font-size": "0.875rem",
  "--sidebar-motion-duration": "250ms",
  "--sidebar-motion-fast-duration": "150ms",
  "--sidebar-motion-easing": "cubic-bezier(0.32, 0.72, 0, 1)",
  "--sidebar-surface": "#fcfcfc",
  "--sidebar-foreground": "#0d0d0d",
  "--sidebar-muted-foreground": "#8f8f8f",
  "--sidebar-row-highlight": "rgb(0 0 0 / 7%)",
  "--sidebar-border": "rgb(0 0 0 / 5%)",
  "--sidebar-border-strong": "rgb(0 0 0 / 15%)",
  "--sidebar-focus-ring": "oklch(0.708 0 0)",
  "--sidebar-overlay": "rgb(0 0 0 / 50%)",
  "--sidebar-shadow": "0 0 4rem rgb(0 0 0 / 7%)",
} satisfies Record<SidebarTokenName, string>

export function createSidebarTokenStyle(
  tokens?: SidebarTokenOverrides,
): SidebarStyle {
  return {
    ...sidebarDefaultTokens,
    ...tokens,
  }
}
export function pickSidebarTokenStyle(style?: SidebarStyle): SidebarTokenOverrides {
  if (!style) return {}

  const tokens: SidebarTokenOverrides = {}
  for (const [name, value] of Object.entries(style)) {
    if (name.startsWith("--sidebar-") && typeof value === "string") {
      tokens[name as SidebarTokenName] = value
    }
  }
  return tokens
}
