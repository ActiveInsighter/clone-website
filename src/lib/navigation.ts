import type { NavigationItem } from "@/types/navigation";

export function matchesNavigationItem(
  item: NavigationItem,
  pathname: string,
): boolean {
  if (item.match) return item.match(pathname);

  const patterns = item.activePatterns ?? (item.href ? [item.href] : []);
  return patterns.some((pattern) => {
    if (pattern === "/") return pathname === "/";
    return pathname === pattern || pathname.startsWith(`${pattern}/`);
  });
}
