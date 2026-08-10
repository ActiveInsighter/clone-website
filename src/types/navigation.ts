import type { LucideIcon } from "lucide-react";

export type NavigationMatch = (pathname: string) => boolean;

export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  badge?: string | number;
  description?: string;
  activePatterns?: string[];
  match?: NavigationMatch;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  title?: string;
  items: NavigationItem[];
}
