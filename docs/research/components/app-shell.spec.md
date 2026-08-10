# AppShell Specification

## Overview

- **Target files:** `src/components/app-shell/app-shell.tsx`, `app-sidebar.tsx`, `app-sidebar-group.tsx`, `app-sidebar-item.tsx`, `app-sidebar-footer.tsx`, `app-header.tsx`
- **Screenshot:** `docs/design-references/supabase-studio-database-collapsed.png`
- **Interaction model:** click-driven route navigation + persisted sidebar behavior + hover-driven overlay expansion + mobile Sheet navigation.

## Source references

- Supabase `apps/studio/components/interfaces/Sidebar.tsx`: sidebar behavior enum, local persistence, hover expansion, grouped route rendering, and footer behavior menu.
- Supabase `apps/studio/components/layouts/DefaultLayout.tsx`: the first-level sidebar begins below the header and shares a horizontal content row with the page.
- Supabase `packages/ui/src/components/shadcn/ui/sidebar.tsx`: `overflowing` separates the layout footprint from the visible panel width.
- Supabase `apps/studio/components/layouts/Navigation/NavigationBar/MobileNavigationBar.tsx`: mobile top bar and Sheet-based primary navigation model.

## Exact reference values

- Header height: `54px`.
- Primary collapsed rail: `53.43px` measured; implementation token is `54px`.
- Primary expanded width: implementation token is `234px`.
- Primary row height: `36px`.
- Primary row gap: `4.5px` between 36px rows.
- Primary row radius: `6.75px` measured; implementation uses `0.375rem`.
- Body font: `inter, "inter Fallback", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`.
- Dark background: `oklch(0.19 0.0025 159)`.
- Dark foreground: `oklch(0.95 0.00275 159)`.
- Dark active row: `oklch(0.95 0.00275 159 / 0.0493421)`.
- Transition: implementation uses a restrained `100ms ease-linear` for panel width and label reveal.

## DOM structure

```text
AppShell
├─ header slot + mobile navigation trigger
└─ shell row
   ├─ AppSidebar
   │  ├─ grouped NavigationItem links (no extra brand header)
   │  └─ footer slot + behavior menu
   └─ AppContent
```

## API contract

```tsx
<AppShell
  navigation={primaryNavigation}
  header={<AppHeader breadcrumbs={["Database"]} />}
>
  <Page />
</AppShell>
```

## Responsive behavior

- `>=768px`: the primary panel or rail renders in the shell row.
- `<768px`: the desktop rail is hidden and replaced with one Sheet containing only primary navigation.
- Main content remains `min-w-0 min-h-0 overflow-y-auto` at every width.
