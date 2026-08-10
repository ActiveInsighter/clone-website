export type NavigationViewportMode = "desktop" | "compact" | "mobile";

export function getNavigationViewportMode(
  width: number,
  desktopBreakpoint = 1200,
  compactBreakpoint = 900,
): NavigationViewportMode {
  if (width < compactBreakpoint) return "mobile";
  if (width < desktopBreakpoint) return "compact";
  return "desktop";
}
