import type { NavigationItem } from "@/types/navigation";

export function stripNavigationBasePath(pathname: string, basePath = ""): string {
  if (!basePath) return pathname;

  const normalizedBasePath = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;

  if (pathname === normalizedBasePath) return "/";
  if (pathname.startsWith(`${normalizedBasePath}/`)) {
    return pathname.slice(normalizedBasePath.length) || "/";
  }

  return pathname;
}

export function resolveNavigationHref(href: string | undefined, basePath = ""): string | undefined {
  if (!href) return href;
  if (!basePath || /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith("#")) return href;

  const normalizedBasePath = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;

  if (href === "/") return normalizedBasePath || "/";
  return `${normalizedBasePath}${href.startsWith("/") ? href : `/${href}`}`;
}

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
