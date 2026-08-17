import type {
  NavigationItemState,
  MobileNavigationRenderContext,
  NavigationMenuRenderContext,
  ResponsiveNavigationProps,
  ResponsiveNavigationClassNames,
  SiteNavigationColumn,
  SiteNavigationItem,
  SiteNavigationLink,
  SiteNavigationMenu,
} from "./navigation-types";
import type { NavigationViewportMode } from "./navigation-mode";

export type NavigationState<Id extends string = string> = {
  openMenuId: Id | null;
  mobileOpen: boolean;
  mobileMenuId: Id | null;
};

export type NavigationAction<Id extends string = string> =
  | { type: "open-menu"; id: Id | null }
  | { type: "set-mobile-open"; open: boolean }
  | { type: "set-mobile-menu"; id: Id | null }
  | { type: "escape" };

export function canOpenNavigationMenu(item: {
  disabled?: boolean;
  menu?: object;
}): boolean {
  return !item.disabled && Boolean(item.menu);
}

export function reduceNavigationState<Id extends string>(
  state: NavigationState<Id>,
  action: NavigationAction<Id>,
): NavigationState<Id> {
  switch (action.type) {
    case "open-menu":
      return action.id === null
        ? { ...state, openMenuId: null }
        : { openMenuId: action.id, mobileOpen: false, mobileMenuId: null };
    case "set-mobile-open":
      return action.open
        ? { openMenuId: null, mobileOpen: true, mobileMenuId: state.mobileMenuId }
        : { ...state, mobileOpen: false, mobileMenuId: null };
    case "set-mobile-menu":
      return {
        ...state,
        mobileOpen: action.id === null ? state.mobileOpen : true,
        mobileMenuId: action.id,
        openMenuId: null,
      };
    case "escape":
      return { openMenuId: null, mobileOpen: false, mobileMenuId: null };
  }
}

export function reconcileNavigationStateForViewport<Id extends string>(
  state: NavigationState<Id>,
  mode: NavigationViewportMode,
): NavigationState<Id> {
  if (mode === "desktop") {
    return { openMenuId: null, mobileOpen: false, mobileMenuId: null };
  }

  if (mode === "compact") {
    return { openMenuId: null, mobileOpen: false, mobileMenuId: null };
  }

  return state;
}

export type {
  NavigationItemState,
  MobileNavigationRenderContext,
  NavigationMenuRenderContext,
  ResponsiveNavigationProps,
  ResponsiveNavigationClassNames,
  SiteNavigationColumn,
  SiteNavigationItem,
  SiteNavigationLink,
  SiteNavigationMenu,
};
