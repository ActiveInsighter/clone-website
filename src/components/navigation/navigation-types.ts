import type { ReactNode } from "react";

export type SiteNavigationLink = {
  id?: string;
  label: ReactNode;
  href: string;
  external?: boolean;
  disabled?: boolean;
};

export type SiteNavigationColumn = {
  id?: string;
  title?: ReactNode;
  items: SiteNavigationLink[];
};

export type SiteNavigationMenu = {
  columns: SiteNavigationColumn[];
};

export type SiteNavigationItem<Id extends string = string> = {
  id: Id;
  label: ReactNode;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  menuLabel?: string;
  menu?: SiteNavigationMenu;
};

export type NavigationItemState = {
  open: boolean;
  focused: boolean;
  disabled: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

export type NavigationMenuRenderContext<Id extends string = string> = {
  openMenuId: Id | null;
  closeMenu: () => void;
};

export type MobileNavigationRenderContext<Id extends string = string> = {
  items: SiteNavigationItem<Id>[];
  openMenuId: Id | null;
  openMobileMenu: (id: Id | null) => void;
  closeMobileMenu: () => void;
};

export type ResponsiveNavigationProps<Id extends string = string> = {
  ariaLabel?: string;
  skipLink?: { href: string; label: ReactNode };
  items: SiteNavigationItem<Id>[];
  logo: ReactNode;
  navigationEndContent?: ReactNode;
  endContent?: ReactNode;
  compactContent?: ReactNode;
  mobileBarContent?: ReactNode;
  mobileContent?: ReactNode;
  mobileTriggerIcon?: ReactNode;
  backdropContent?: ReactNode;
  overlayContent?: ReactNode;
  renderTrigger?: (item: SiteNavigationItem<Id>, state: NavigationItemState) => ReactNode;
  renderMenu?: (item: SiteNavigationItem<Id>, context: NavigationMenuRenderContext<Id>) => ReactNode;
  renderMobileMenu?: (context: MobileNavigationRenderContext<Id>) => ReactNode;
  menuBehavior?: "hover-focus" | "click" | "hover-focus-click";
  desktopBreakpoint?: "sm" | "md" | "lg" | "xl" | "900px" | "1200px";
  compactBreakpoint?: "900px";
  onEscape?: () => void;
  openMenuId?: Id | null;
  defaultOpenMenuId?: Id | null;
  onOpenMenuChange?: (id: Id | null) => void;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  className?: string;
  classNames?: ResponsiveNavigationClassNames;
};

export type ResponsiveNavigationClassNames = {
  root?: string;
  bar?: string;
  barInner?: string;
  brand?: string;
  desktop?: string;
  navigation?: string;
  list?: string;
  item?: string;
  trigger?: string;
  menuButton?: string;
  panel?: string;
  mobile?: string;
  mobileToggle?: string;
  mobileTrigger?: string;
  actions?: string;
  mobileActions?: string;
};
