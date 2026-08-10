# Sidebar Base Specification

## Overview

- **Target:** `src/components/sidebar/index.ts`
- **Implementation:** `src/components/chat-sidebar/chat-sidebar.tsx`
- **Interaction model:** controlled/uncontrolled click-driven desktop collapse, keyboard shortcut, responsive mobile drawer

## Reusable contract

`SidebarRoot` owns state, optional uncontrolled persistence, keyboard toggling, sizing variables, and the mobile breakpoint. `Sidebar` accepts an optional `rail` slot and renders the expanded content separately so the two states can cross-fade without changing item coordinates. `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarSection`, `SidebarMenu`, and the rail primitives are presentational compound parts. The implementation has no product copy or product-specific icon dependency; consumers provide those through slots.

## Alignment rules

- Expanded width is configurable; the ChatGPT skin passes `260px`.
- Collapsed rail width is configurable; the ChatGPT skin passes `59px`.
- Header height is configurable; the ChatGPT skin passes `59px`.
- Icon controls use a fixed `40px` slot and a centered 20px SVG.
- Rail header uses the same fixed slot as rail buttons. Hover-only icon swaps must happen inside that slot; consumers must not add a second toggle row.
- All menu buttons share one height and horizontal inset so labels and trailing actions align across sections.

## Responsive behavior

- At `768px` and above, the sidebar reserves its width in the page flex row.
- Below `768px`, the desktop shell is hidden and the same expanded children render inside the reusable Sheet drawer.
- `aria-hidden` and `inert` keep the visually hidden state out of the interaction tree.

## Verification

- Collapse/expand keeps the main surface stable and does not navigate.
- `Ctrl/Cmd+B` toggles the desktop state.
- Uncontrolled refresh preserves the last desktop state through the configured cookie; controlled consumers own their persistence callback.
