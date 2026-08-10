# Primary Sidebar Specification

## Overview

- **Target files:** `src/hooks/use-sidebar-behavior.ts`, `src/components/app-shell/app-sidebar.tsx`, `app-sidebar-group.tsx`, `app-sidebar-item.tsx`, `app-sidebar-footer.tsx`
- **Interaction model:** click-driven route navigation and behavior selection, pointer-driven overlay expansion, persisted behavior preference, mobile Sheet fallback.
- **Scope:** one reusable first-level application/project sidebar. No product or secondary sidebar is rendered by `AppShell`.

## Source evidence

- Supabase `apps/studio/components/interfaces/Sidebar.tsx` uses `open`, `closed`, and `expandable` behavior preferences, a persisted radio menu, and pointer enter/leave to toggle the shadcn sidebar.
- Supabase's modified Sidebar primitive separates the `overflowing` layout footprint from the visible panel width. The clone keeps the same separation through the `reservedWidth` wrapper and an absolutely positioned desktop panel.
- External Chrome reference viewport: `1441 × 770`, `devicePixelRatio: 1.75`.

## Geometry and layout

- Header: `54px` high; the sidebar begins at `y=54px` and never covers the header.
- Reserved rail: `54px` (`53.43px` measured on the live page).
- Expanded panel: `234px` implementation token (approximately `13rem` at the reference root size).
- Navigation item: `36px` high, `9px` left inset, `4.5px` item gap, `9px` group padding, `6px` radius.
- Footer: normal flex child at the bottom of the sidebar; it does not scroll with navigation.
- In hover mode the wrapper remains `54px`, while the visible panel expands to `234px` over `AppContent`.

## Component contract

```text
SidebarBehaviorProvider
└─ AppShell
   ├─ AppHeader
   ├─ AppSidebar
   │  ├─ SidebarProvider
   │  ├─ SidebarContent
   │  │  └─ SidebarGroup → SidebarMenu → SidebarMenuItem → SidebarMenuButton
   │  └─ SidebarFooter → SidebarBehaviorMenu
   └─ AppContent
```

Navigation data is supplied as `NavigationGroup[]`. The primitive does not know Supabase route names; active state is resolved by `matchesNavigationItem` before it reaches `SidebarMenuButton`.

## Behavior states

### Expanded

- Preference: `expanded`.
- Actual state: always expanded.
- Reserved width and panel width: `234px`.
- Pointer leave does not change the panel.

### Collapsed

- Preference: `collapsed`.
- Actual state: always collapsed.
- Reserved width and panel width: `54px`.
- Pointer hover does not expand the panel.
- Menu items expose immediate tooltips through `SidebarMenuButton`.

### Expand on hover

- Preference: `expand-on-hover`.
- Actual state: collapsed until the pointer enters the rail; expanded while it is inside the visible panel.
- Reserved width remains `54px` in both states, so `AppContent` stays at the same x-coordinate.
- Pointer leave collapses the visible panel without changing the stored preference.
- The icon SVG x-coordinate remains `18px` in both states.

## Behavior menu

- Uses `DropdownMenu`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuRadioGroup`, and `DropdownMenuRadioItem`.
- Options: `Expanded`, `Collapsed`, `Expand on hover`.
- The preference is stored under `app-shell-sidebar-behavior` and restored after refresh.
- The trigger remains an icon-only `29px × 26px` control in both expanded and collapsed states, preventing horizontal trigger movement.

## Responsive behavior

- Desktop breakpoint: `md` (`768px`).
- Below `md`, the desktop rail is hidden and the same primary navigation renders in a Sheet with a dedicated mobile header and close button.
- The mobile Sheet always renders the expanded navigation labels; no secondary navigation is included.

## Visual states

- Active background: `oklch(0.95 0.00275 159 / 0.0493421)`.
- Inactive label/icon color: `oklch(0.684 0.00275 159)`.
- Expanded/collapsed transition: `100ms ease-linear` width/label transition, matching the restrained Studio interaction.
- Expanded state does not render a redundant label tooltip.
