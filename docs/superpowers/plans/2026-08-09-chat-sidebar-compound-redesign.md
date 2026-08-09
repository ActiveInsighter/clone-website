# Chat sidebar compound redesign implementation plan

> Execute in a dedicated `codex/chat-sidebar-redesign` branch. Preserve
> unrelated dirty files and stage only the paths named by each task. Every
> implementation task follows red → green → refactor and records the failing
> and passing command.

**Goal:** Replace the experimental sidebar with a product-neutral compound
component whose geometry, state, scrolling, polymorphism, motion, and
accessibility naturally reproduce ChatGPT sidebar behavior across data sizes
and breakpoints.

**Architecture:** `SidebarRoot` is the only provider. `SidebarShell` keeps the
desktop rail/panel dual layer and mobile Sheet. `SidebarPanel` contains ordered
Header, FixedTop, one ScrollArea, and Footer regions. Menu items own the row
surface and reserved action grid. Base UI `useRender` supplies polymorphic
button/link semantics. ChatGPT data and actions remain in a separate feature
layer.

**Stack:** Next.js 16.3 App Router, React 19, TypeScript strict, Tailwind CSS 4,
Base UI 1.3, shadcn Base primitives, Node test runner, Chrome connector.

---

## Task 1: Preserve the experimental baseline and merge audit evidence

**Paths:**

- Existing: `src/components/chat-sidebar/**`
- Existing: `src/components/sidebar/index.ts`
- Existing: `src/components/chatgpt-sidebar-demo.tsx`
- Existing: `src/components/chatgpt-sidebar-demo/**`
- Existing: `tests/chat-sidebar-state.test.ts`
- Existing: `tests/chatgpt-sidebar-model.test.ts`
- Evidence: `docs/research/audits/**`

1. Confirm baseline `npm test` and `npm run build` pass.
2. Commit only the existing sidebar/demo/test paths as a recoverable checkpoint;
   do not stage other pre-existing workspace changes.
3. Cherry-pick the three audit-only agent commits.

## Task 2: Drive pure sidebar state from failing tests

**Modify:**

- `tests/chat-sidebar-state.test.ts`
- `src/components/sidebar/state.ts`

**Remove after migration:**

- `src/components/chat-sidebar/state.ts`

1. Add literal, table-driven tests for malformed/duplicate cookies, secure
   serialization options, case-insensitive shortcuts, editable target guards,
   repeat/composition/default-prevented/Alt rejection, Control/Meta held state,
   blur reset, and independent desktop/mobile reducer transitions.
2. Run `npm test -- --test-name-pattern sidebar` and confirm failures are due to
   missing new exports/behavior.
3. Implement pure types and functions in `src/components/sidebar/state.ts`.
   Keep it free of React, DOM globals at module evaluation, and `"use client"`.
4. Re-run the focused tests and refactor names only while green.

## Task 3: Drive ChatGPT ordering and reducer integrity from failing tests

**Modify:**

- `tests/chatgpt-sidebar-model.test.ts`
- `src/components/chatgpt-sidebar-demo/model.ts`

1. Add tests proving visible pinned chats are one continuous prefix, archived or
   non-matching chats are omitted, eligible IDs occur exactly once, and relative
   order is stable.
2. Add mutation sequences covering pin/unpin, query, move, archive, delete,
   active chat/project cleanup, unknown-ID no-ops, immutability, and duplicate-ID
   rejection for create actions.
3. Run the model test file directly and confirm the selector/integrity tests
   fail against the current reducer.
4. Add `getVisibleChatGroups`/`flattenVisibleChatGroups` and make reducer guards
   explicit. Re-run until green.

## Task 4: Build the root state and token foundation

**Create:**

- `src/components/sidebar/types.ts`
- `src/components/sidebar/context.tsx`
- `src/components/sidebar/tokens.ts`
- `src/components/sidebar/sidebar.css`

**Modify:**

- `src/components/sidebar/index.ts`

1. Define the public controlled/uncontrolled desktop and mobile props, cookie
   options, shared context values, and CSS-token style type.
2. Implement `SidebarRoot` with effective-state persistence, modifier tracking,
   safe global Primary+B handling, live breakpoint selection, and focus-trigger
   registration. Do not perform an after-paint cookie read.
3. Define normalized geometry/color/motion variables and reduced-motion
   overrides in `sidebar.css`; import it from the public implementation.
4. Expose only canonical `Sidebar*` names and public types from the barrel.
5. Run `npm test` and `npm run typecheck`.

## Task 5: Build shell and structural scroll regions

**Create:**

- `src/components/sidebar/shell.tsx`
- `src/components/sidebar/layout.tsx`

1. Implement `SidebarShell`, `SidebarPanel`, and `SidebarInset`. Desktop keeps
   rail and panel mounted as exclusive inert/aria-hidden layers. Mobile renders
   the panel through the existing Base UI-backed Sheet with title/description.
2. Implement `SidebarHeader`, `SidebarFixedTop`, `SidebarScrollArea`, and
   `SidebarFooter`. Do not expose arbitrary sticky props. The scroll area is the
   only element with vertical overflow and uses a stable visible gutter.
3. Ensure root/shell width and both layer fades consume shared motion tokens.
4. Typecheck, then build to catch Server/Client and Sheet integration issues.

## Task 6: Build the unified menu, section, controls, and rail compounds

**Create:**

- `src/components/sidebar/menu.tsx`
- `src/components/sidebar/section.tsx`
- `src/components/sidebar/controls.tsx`
- `src/components/sidebar/rail.tsx`
- `src/components/sidebar/tooltip.tsx`

1. Implement `SidebarMenu`, `SidebarMenuItem`, and a `useRender`-backed
   `SidebarMenuButton`. Default to `button type="button"`; merge consumer props,
   class, handlers, ref, and render element without nested interaction.
2. Give `SidebarMenuItem` one row surface and a normal-flow grid with persistent
   trailing/action lanes. Reveal actions on hover, focus-within, and descendant
   `aria-expanded=true` without changing text geometry.
3. Implement `SidebarShortcutHint` using root modifier state and permanent
   layout reservation.
4. Implement explicit Base UI Collapsible section parts with stable
   trigger/content semantics and reserved section actions.
5. Implement rail header/menu/footer/buttons, icon buttons, desktop/mobile
   triggers, and tooltip composition. Every icon-only default requires an
   accessible label supplied by the consumer.
6. Use the same icon-anchor variable in expanded rows/header/footer and the
   compact rail. Run lint, typecheck, and build.

## Task 7: Migrate and split the ChatGPT feature

**Create/modify:**

- `src/components/chatgpt-sidebar-demo/index.tsx`
- `src/components/chatgpt-sidebar-demo/chat-row.tsx`
- `src/components/chatgpt-sidebar-demo/project-row.tsx`
- `src/components/chatgpt-sidebar-demo/dialogs.tsx`
- `src/components/chatgpt-sidebar-demo/account-menu.tsx`
- `src/components/chatgpt-sidebar-demo/data.ts`
- `src/components/chatgpt-home.tsx`
- `src/config/chatgpt-sidebar.ts`

**Remove:**

- `src/components/chatgpt-sidebar-demo.tsx`
- `src/components/chat-sidebar/**`

1. Compose Header → FixedTop(New Chat) → ScrollArea(all remaining items and
   sections) → Footer. Use selectors from Task 3 for pinned/history ordering.
2. Convert all destinations to Next Links/anchors through `render`; retain
   buttons for commands. Make chat/project actions sibling controls and delete
   manual end-padding, duplicated menu-open state, and duplicate hover classes.
3. Render `Ctrl + Shift + O` through `SidebarShortcutHint`; add the feature-level
   New Chat keyboard handler using the same editable-target safeguards.
4. Keep active/current project and chat state semantic and visually stable.
5. Split dialogs and business menus without moving feature copy or reducer data
   into primitives.
6. Delete the obsolete implementation and update every import in one breaking
   change. Run `rg "ChatSidebar|chat-sidebar|sticky|pr-\[4\.75rem\]" src tests`
   and resolve all obsolete references except intentional prose/history.
7. Run tests, lint, typecheck, and build.

## Task 8: Desktop and long-scroll Chrome verification

**Reference:**

- `docs/research/components/chatgpt-sidebar.spec.md`

1. Start the app on an available port discovered from the current process list;
   do not terminate or reuse another task's server.
2. At 1440×900, measure header/footer icon centres before and after
   expand → collapse → expand; tolerance is 0.5px.
3. Verify hover, keyboard focus, active/current, and open dropdown do not move
   label bounds or actions.
4. Hold and release Control and Meta and blur the window. Verify the shortcut
   hint reveals/resets without title movement or editable-field interference.
5. Overflow history, expand sections, and scroll to the end. Header, New Chat,
   and Footer remain fixed; File Library and all later content scroll; the last
   row remains reachable.
6. Inspect accessibility: correct link/button DOM, labels, landmarks,
   aria-expanded/current, inactive inert layer, and tab order.

## Task 9: Mobile and reduced-motion Chrome verification

1. At 768×900 and 390×844, open/close the Sheet from the page trigger, Escape,
   and overlay. Verify focus trap/return and independent desktop/mobile state.
2. Re-run long-content and section checks inside the Sheet; the footer remains
   visible.
3. Emulate `prefers-reduced-motion: reduce`; verify width/fade/disclosure/action
   transitions resolve immediately while focus and final state remain correct.
4. Save updated screenshots under `docs/design-references/chatgpt/` only when
   they are complete and representative.

## Task 10: Final verification and review

1. Run `npm test`.
2. Run `npm run lint`.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Request an independent subagent code review against the redesign spec; fix
   all correctness/accessibility issues and re-run affected gates.
6. Inspect `git diff --check`, scoped status, and final diff. Commit only sidebar
   implementation, feature migration, tests, and relevant docs; leave all
   unrelated pre-existing changes untouched.
