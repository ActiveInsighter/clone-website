export type NavigationViewportMode = "desktop" | "compact" | "mobile";

export function resolveNavigationBreakpoint(value: string): number {
  if (value.endsWith("px")) return Number.parseInt(value, 10);

  return {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }[value] ?? 0;
}

export function getNavigationViewportMode(
  width: number,
  desktopBreakpoint = 1200,
  compactBreakpoint = 900,
): NavigationViewportMode {
  if (width < compactBreakpoint) return "mobile";
  if (width < desktopBreakpoint) return "compact";
  return "desktop";
}
