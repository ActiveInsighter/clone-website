import type { ResponsiveNavigationClassNames } from "@/components/navigation/navigation-types";

export const openAiNavigationTokens = {
  desktopBarHeight: "72px",
  mobileBarHeight: "61px",
  desktopInset: "36px",
  wordmarkWidth: "62.77px",
  wordmarkHeight: "17px",
  navigationFontSize: "19.125px",
  iconSize: "45px",
  actionHeight: "40.5px",
  panelInset: "36px",
  breakpoint: "1200px",
  compactBreakpoint: "900px",
} as const;

export const openAiNavigationClassNames: ResponsiveNavigationClassNames = {
  bar: "openai-header-bar",
  barInner: "openai-header-container",
  brand: "openai-brand",
  desktop: "openai-desktop-main",
  navigation: "openai-desktop-nav",
  list: "openai-desktop-nav-list",
  item: "openai-desktop-nav-item",
  trigger: "openai-desktop-nav-trigger",
  menuButton: "openai-desktop-nav-arrow",
  panel: "openai-mega-menu",
  mobile: "openai-mobile-surface",
  mobileToggle: "openai-mobile-actions",
  mobileTrigger: "openai-icon-button openai-mobile-menu-trigger",
  actions: "openai-action-group",
};

export const openAiNavigationTheme = {
  className: "openai-site-header",
  classNames: openAiNavigationClassNames,
  desktopBreakpoint: "1200px" as const,
  compactBreakpoint: "900px" as const,
};
