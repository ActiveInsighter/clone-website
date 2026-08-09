# Responsive Navigation Refactor Design

## Goal

Refactor the existing OpenAI homepage header into a high-quality, reusable navigation component built from shadcn/ui primitives. The reusable layer must support simple configuration for common sites and deep customization for product-specific branding, menu content, actions, responsive behavior, and interaction policies. The OpenAI clone must consume that reusable layer rather than embedding a one-off navigation implementation.

## Scope and boundaries

- The reusable layer owns navigation layout, desktop and mobile presentation, menu state, trigger semantics, shared Mega Menu behavior, responsive visibility, focus/keyboard behavior, motion preferences, and styling escape hatches.
- The reusable layer does not own product-specific search, authentication, analytics, account state, or network requests. Those behaviors enter through action and overlay slots.
- The OpenAI adapter owns OpenAI copy, links, logo, menu data, search UI, login menu, ChatGPT CTA, external-link labels, and OpenAI-specific visual tokens.
- The existing OpenAI homepage content remains in scope as the consumer example. This task does not add a backend, authentication, or real search service.
- Existing unrelated worktree changes remain untouched. The existing `src/types/navigation.ts` used by the Supabase-style navigation remains compatible; the new site-navigation types live beside the component to avoid coupling unrelated consumers.

## Current target behavior

The live `https://openai.com/zh-Hans-CN/` page is the visual and interaction reference.

- At the captured desktop viewport of 1441px, the header wrapper has zero flow height and contains a fixed 72px bar at the top of the viewport.
- The bar is black, spans the viewport, uses a high stacking order, and has horizontal padding of approximately 36px.
- The OpenAI inline SVG wordmark renders at approximately 62.77px wide by 17px high.
- The primary navigation is a single horizontal list. Five items can open menus; the Foundation link is an external link without a menu.
- Menu-capable items use hover and focus to select a single shared fixed region below the bar. The region animates height and changes its columns rather than rendering independent dropdowns beside each item.
- The selected menu's inactive siblings are visually muted. The arrow control is available to keyboard focus while the pointer interaction is driven by the surrounding navigation item.
- Search occupies a 45px circular icon-button area. Login is a 40.5px translucent pill. The ChatGPT CTA is a light pill with an external-link indicator.
- The shared menu region begins at `top: 72px`, has a black background, hides overflow during its height transition, and uses a short cubic-bezier transition. Its height is content-dependent; it is not hard-coded to one value for every menu.
- At the mobile breakpoint, the desktop list and desktop actions are replaced with a compact bar and a full-height scrollable navigation surface below it. The mobile branch has its own focus and close behavior.
- All transitions must respect `prefers-reduced-motion`.

## Architecture

### Reusable navigation layer

The new component family is product-neutral:

```text
src/components/navigation/
  responsive-navigation.tsx
  navigation-types.ts
  navigation-state.ts
  navigation-helpers.ts
  responsive-navigation.css
```

`ResponsiveNavigation` is the public composition point. It renders a semantic header, brand slot, desktop navigation, shared menu panel, mobile branch, and consumer-provided actions. Small pure helpers in `navigation-state.ts` keep state transitions deterministic and independently testable.

The component uses shadcn primitives where they provide a stable behavior boundary:

- `Button` for triggers, icon controls, and pill actions;
- `Sheet` for the mobile surface and focus management;
- `ScrollArea` for long mobile or Mega Menu content;
- `DropdownMenu` in the OpenAI adapter for the login action;
- `cn()` and existing shadcn `asChild` patterns for class composition and links.

The shadcn `NavigationMenu` primitive is not used as the sole state owner because its default viewport behavior does not model the target's single shared fixed panel and hover-to-focus transition. The reusable component will use shadcn's lower-level primitives and retain explicit control of the shared panel state.

### OpenAI adapter layer

The OpenAI-specific files are:

```text
src/components/openai-site/
  openai-top-nav.tsx
  openai-navigation-data.ts
  openai-navigation-theme.ts
```

`openai-top-nav.tsx` becomes a thin adapter. It supplies the OpenAI logo, Chinese menu data, external-link treatment, search panel, login menu, ChatGPT CTA, and theme class names to `ResponsiveNavigation`. `openai-home.tsx` continues to use `<OpenAiTopNav />`, so the page-level consumer remains easy to read.

## Public API

The public API is configuration-first with opt-in render slots for advanced consumers:

```tsx
type SiteNavigationItem<Id extends string = string> = {
  id: Id;
  label: React.ReactNode;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  menu?: SiteNavigationMenu;
};

type SiteNavigationMenu = {
  columns: SiteNavigationColumn[];
};

type SiteNavigationColumn = {
  id?: string;
  title?: React.ReactNode;
  items: SiteNavigationLink[];
};

type SiteNavigationLink = {
  id?: string;
  label: React.ReactNode;
  href: string;
  external?: boolean;
  disabled?: boolean;
};

type NavigationItemState = {
  open: boolean;
  focused: boolean;
  disabled: boolean;
};

type NavigationMenuRenderContext<Id extends string> = {
  openMenuId: Id | null;
  closeMenu: () => void;
};

type MobileNavigationRenderContext<Id extends string> = {
  items: SiteNavigationItem<Id>[];
  openMenuId: Id | null;
  closeMobileMenu: () => void;
};

type ResponsiveNavigationClassNames = {
  root?: string;
  bar?: string;
  brand?: string;
  navigation?: string;
  item?: string;
  trigger?: string;
  panel?: string;
  mobile?: string;
  actions?: string;
};

type ResponsiveNavigationProps<Id extends string = string> = {
  items: SiteNavigationItem<Id>[];
  logo: React.ReactNode;
  endContent?: React.ReactNode;
  mobileContent?: React.ReactNode;
  overlayContent?: React.ReactNode;
  renderTrigger?: (item: SiteNavigationItem<Id>, state: NavigationItemState) => React.ReactNode;
  renderMenu?: (item: SiteNavigationItem<Id>, context: NavigationMenuRenderContext<Id>) => React.ReactNode;
  renderMobileMenu?: (context: MobileNavigationRenderContext<Id>) => React.ReactNode;
  menuBehavior?: "hover-focus" | "click" | "hover-focus-click";
  desktopBreakpoint?: "sm" | "md" | "lg" | "xl" | "900px";
  openMenuId?: Id | null;
  defaultOpenMenuId?: Id | null;
  onOpenMenuChange?: (id: Id | null) => void;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  className?: string;
  classNames?: ResponsiveNavigationClassNames;
};
```

Default rendering covers ordinary links, buttons, menu-capable links, column-based Mega Menus, external-link indicators, and mobile menu items. `renderTrigger`, `renderMenu`, `renderMobileMenu`, `endContent`, and `mobileContent` cover cases where a consumer needs a custom control without forking the component.

Controlled and uncontrolled props are intentionally paired. A consumer can start with `defaultOpenMenuId` and later take control with `openMenuId`, while callbacks remain stable for analytics or product state synchronization. Search and login are not first-class navigation state; the adapter owns them and places their controls in the action slots.

`overlayContent` is rendered inside the header after the shared menu and mobile surface. It is a placement slot for consumer-owned layers such as the OpenAI search panel or a site-specific notification surface; the navigation component does not open, close, or interpret that content.

## State and interaction model

The reusable state is intentionally small:

```text
openMenuId: Id | null
mobileOpen: boolean
mobileMenuId: Id | null        # only needed by the default mobile renderer
focusedItemId: Id | null       # derived from focus events for styling/ARIA
```

Behavior rules:

1. A menu-capable item opens its menu on pointer enter when `menuBehavior` includes hover.
2. A menu-capable item opens its menu when its trigger or menu control receives keyboard focus.
3. Click behavior is enabled only when `menuBehavior` includes click; a menu-capable item with an `href` retains link navigation through its link trigger.
4. Entering the shared panel keeps the selected menu open. Leaving the navigation region and panel closes it after the configured short transition boundary.
5. Escape closes the open menu, closes the mobile surface, and returns focus to the initiating control when that control is still mounted.
6. Opening the mobile surface closes the desktop menu. Opening a desktop menu closes the mobile surface.
7. Disabled items remain in the data model but do not open menus or navigate.
8. The default mobile renderer uses the same item data and exposes a replaceable mobile render slot so a consumer can choose a flat list, inline sections, or drill-down presentation.
9. Controlled props are the source of truth. Uncontrolled props use internal state initialized from their defaults and notify through the same callbacks.
10. Reduced-motion users receive the same final states without height, opacity, or transform animation.

## Accessibility and semantics

- Use a semantic `header` and `nav` with an accessible label.
- Use real links for navigation and buttons for state-changing controls.
- Menu-capable triggers expose `aria-expanded` and `aria-controls` with stable IDs.
- The shared panel uses a labelled region and is removed from the interactive path when closed.
- The mobile branch uses the shadcn Sheet semantics and exposes only the open surface to keyboard users.
- Every icon-only action receives an accessible label from the consumer or a required prop.
- Focus-visible styles remain visible on dark and light themes.
- Pointer hover is an enhancement; keyboard focus always reaches the same menu content.

## Visual system

The generic layer exposes state data attributes and class slots instead of baking OpenAI values into its implementation:

- `data-layout="desktop" | "mobile"`;
- `data-state="open" | "closed"` on menu and mobile surfaces;
- `data-menu-id` on item wrappers;
- class slots for root, bar, brand, navigation, item, trigger, panel, mobile surface, and actions.

The OpenAI theme supplies the concrete values observed from Chrome: 72px desktop bar, approximately 61px mobile bar, 36px desktop inset, OpenAI Sans font stack, black surface, muted white icon controls, 45px search control, 40.5px action pills, and short easing curves for panel height and opacity. The theme also supplies the OpenAI wordmark and external-link treatment.

The component ships stable breakpoint presets (`sm`, `md`, `lg`, `xl`, and the target-specific `900px`). Consumers can provide a wrapper class through `className`/`classNames` when a project uses a different breakpoint token; the component does not build arbitrary runtime media-query strings from user input.

## Testing and verification

### Automated tests

Before writing production implementation, add failing tests for the pure navigation state helpers. The tests cover:

- opening one menu and replacing it with another;
- closing the active menu;
- ignoring disabled menu items;
- synchronizing controlled and uncontrolled transitions;
- closing mobile state when desktop state opens, and vice versa;
- Escape behavior and focus-return intent.

The tests use the existing Node test command and test real helper functions rather than mocks. JSX behavior is verified by TypeScript, lint, production rendering, and browser interaction checks because the repository does not currently include a React DOM test harness.

### Browser verification

Use Chrome to compare the original and local page at 1440px, 768px, and 390px. Verify initial, hover, focus, open-menu, search, login, mobile-open, and reduced-motion states. Capture reference screenshots and update the component specs under `docs/research/components/` as part of the clone workflow.

### Project checks

The implementation must pass:

```text
npm test
npm run lint
npm run typecheck
npm run build
```

## Implementation sequence

1. Create this design document and review it for placeholders, contradictions, and unclear ownership.
2. Create the implementation plan in `docs/superpowers/plans/` after design approval.
3. Read the repository's Next.js 16 guidance from `node_modules/next/dist/docs/` before editing code.
4. Add failing navigation state tests and verify the expected failures.
5. Implement the type layer and pure state helpers.
6. Implement the reusable desktop shell and shared panel with shadcn primitives.
7. Implement the mobile Sheet branch and responsive state attributes.
8. Migrate the OpenAI adapter, data, theme, search, login, and CTA.
9. Remove obsolete OpenAI navigation state and CSS without changing unrelated page sections.
10. Run automated checks and fix regressions.
11. Run Chrome visual QA against the original at all required widths and correct any discrepancies.

## Non-goals

- No real search backend or authentication flow.
- No analytics integration.
- No new design language unrelated to the OpenAI reference.
- No broad refactor of the existing Supabase or ChatGPT sidebar components.
- No dependency replacement when the existing shadcn primitives and utilities are sufficient.
