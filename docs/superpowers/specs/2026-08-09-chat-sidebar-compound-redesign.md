# Chat sidebar compound redesign

Date: 2026-08-09

## Outcome

Replace the experimental sidebar implementation with one breaking,
product-neutral compound component under `src/components/sidebar/`. The new
component keeps the useful behavioral direction of the prototype—controlled
desktop state, a compact rail, an expanded panel, a mobile Sheet, cookies,
collapsible sections, menus, and tooltips—but does not preserve its API or file
layout.

The ChatGPT demo is a feature consumer. It owns ChatGPT copy, routes, icons,
fixture data, dialogs, and reducer actions. The primitive owns only state,
layout, interaction geometry, polymorphic controls, motion, and accessibility.

## Evidence and root causes

The authenticated ChatGPT desktop sidebar was inspected at 1440×900. Relevant
measurements are:

- expanded width: 260px;
- compact rail and header: 58.5px;
- standard row and icon control: 40.5px;
- row margin: 6.75px, inline padding: 11.25px, radius: 10px;
- row type: 15.75px/22.5px;
- panel fade: 150ms linear; rail fade: 150ms stepped;
- footer is outside the long-history scrollport;
- navigation destinations are links and row actions remain mounted;
- the shortcut string is `Ctrl + Shift + O`, including separators.

The current visual jumps do not come from a missing offset. Expanded icons and
rail icons are positioned by unrelated widths, margins, and padding, so their
centres differ. Row actions are absolutely overlaid while feature code adds
manual end padding. Sticky behavior is an arbitrary section boolean. Motion
durations are duplicated. The same component is also both a hard-coded button
and the row surface. These are layout and state-model defects, so adding more
translations or conditional margins would only make them more fragile.

Detailed evidence lives in:

- `docs/research/audits/official-sidebar-audit.md`
- `docs/research/audits/sidebar-api-architecture.md`
- `docs/research/audits/sidebar-test-accessibility-plan.md`

## Public architecture

There is one public state boundary and no compatibility facade:

```tsx
<SidebarRoot
  defaultOpen
  persistence={{ name: "chatgpt_sidebar_state" }}
>
  <SidebarShell side="left" label="历史聊天记录">
    <SidebarRail>{/* compact navigation */}</SidebarRail>
    <SidebarPanel>
      <SidebarHeader>{/* fixed header */}</SidebarHeader>
      <SidebarFixedTop>{/* continuous fixed prefix */}</SidebarFixedTop>
      <SidebarScrollArea>{/* all scrolling content */}</SidebarScrollArea>
      <SidebarFooter>{/* fixed account area */}</SidebarFooter>
    </SidebarPanel>
  </SidebarShell>
  <SidebarInset>{/* page */}</SidebarInset>
</SidebarRoot>
```

`SidebarRoot` owns context, tooltip setup, independent desktop/mobile state,
cookie persistence, the global toggle shortcut, held-modifier state, and root
design tokens. `SidebarShell` owns desktop dual layers and mobile Sheet
presentation. `SidebarPanel` owns the expanded navigation landmark. The rail is
a separate landmark and is never a click-capturing container.

The inactive desktop surface is simultaneously `aria-hidden`, `inert`,
pointer-disabled, and visually hidden. A registered visible trigger receives
focus when collapsing or expanding from keyboard focus so focus never remains
inside an inert tree.

## State contract

Desktop and mobile states are independently controllable:

```ts
type SidebarRootProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  mobileOpen?: boolean
  defaultMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  shortcutKey?: string | null
  persistence?: false | {
    name: string
    maxAge?: number
    path?: string
    sameSite?: "lax" | "strict" | "none"
    secure?: boolean
  }
}
```

Desktop state is the only persisted preference. Persistence follows the
effective controlled/uncontrolled state instead of a requested transition.
The root never reads a cookie in an after-paint effect to repair initial
markup; a route that needs a no-flash initial state passes `defaultOpen` from a
Server Component. The static demo may deliberately use a stable default.

The primary modifier tracker listens to Control/Meta keydown and keyup and
clears on window blur, pagehide, and hidden visibility. Global sidebar toggling
ignores repeat, composition, already-prevented events, Alt combinations, and
input, textarea, select, or contenteditable targets. Modifier-only tracking
never prevents browser defaults and never changes open state.

## Fixed and scrolling regions

The old `sticky` prop is removed. `SidebarPanel` has four ordered regions:

1. `SidebarHeader` — fixed;
2. zero or one `SidebarFixedTop` — fixed continuous prefix;
3. one `SidebarScrollArea` — the only vertical scroll container;
4. `SidebarFooter` — fixed.

This makes `fixed → scroll → fixed` interleaving impossible. In the ChatGPT
consumer, only New Chat is placed in `SidebarFixedTop`. File Library,
Scheduled, Plugins, More, semantic Pinned/Projects/Chats sections, and history
all live in `SidebarScrollArea`.

`SidebarPanel` types its children as one of two ordered tuples — Header,
ScrollArea, Footer; or Header, FixedTop, ScrollArea, Footer — and validates the
same order at runtime. Consumers therefore cannot add a second scrollport or
place a later fixed block after scrolling content through the supported API.

The scroll area uses `min-height: 0`, `overflow-y: auto`, a visible themed
scrollbar, and `scrollbar-gutter: stable`. The footer cannot be pushed out and
scrollbar appearance cannot change row width.

## Shared geometry and tokens

Reusable geometry is defined once on `SidebarRoot` and consumed by all
primitives:

```css
--sidebar-width: 16.25rem;
--sidebar-rail-width: 3.65625rem;
--sidebar-header-height: 3.65625rem;
--sidebar-item-height: 2.53125rem;
--sidebar-icon-button-size: 2.53125rem;
--sidebar-icon-size: 1.25rem;
--sidebar-action-size: 1.75rem;
--sidebar-inline-margin: 0.375rem;
--sidebar-inline-padding: 0.75rem;
--sidebar-item-radius: 0.625rem;
--sidebar-section-gap: 1.125rem;
--sidebar-font-size: 0.875rem;
--sidebar-line-height: 1.375rem;
--sidebar-scrollbar-size: 0.5rem;
--sidebar-scrollbar-gutter: 0.625rem;
--sidebar-motion-duration: 250ms;
--sidebar-motion-fast-duration: 150ms;
--sidebar-motion-easing: cubic-bezier(0.32, 0.72, 0, 1);
```

The defaults deliberately normalize quarter-pixel observations into a small
system while retaining the official visual rhythm. Feature code may override
tokens at the root; primitive classes do not repeat the measured magic values.
The ChatGPT composition overrides row margin, padding, font size, and line
height with the measured 6.75px, 11.25px, 15.75px, and 22.5px values.

Expanded header, rows, rail header, rail actions, expanded footer, and rail
footer share the same inline icon anchor derived from the rail width. Toggling
changes shell width, label visibility, and layer opacity; it does not select a
second padding system. Hover, active, focus, and menu-open states never alter
box size or position.

## Menu row contract

`SidebarMenuItem` owns the row surface and a stable layout grid:

```text
icon | minmax(0, label) | trailing/shortcut | reserved actions
```

The action lane is always measured. Actions stay mounted and change only
opacity/visibility/pointer behavior. Hover, focus-within, active/current, and a
descendant menu trigger with `aria-expanded="true"` use the same row highlight
surface. Direct action hover/focus may add its smaller control highlight. No
feature consumer supplies manual `padding-right` or duplicates hover classes.

`SidebarMenuButton` uses Base UI `useRender`:

```tsx
<SidebarMenuButton onClick={createChat}>New chat</SidebarMenuButton>

<SidebarMenuButton render={<Link href="/library" />}>
  Library
</SidebarMenuButton>

<SidebarMenuButton render={<a href="https://example.com" />}>
  Help
</SidebarMenuButton>
```

The default is a native `<button type="button">`. A rendered Link, anchor, or
ref-forwarding custom control becomes the single interactive root. Actions are
sibling controls in the list item, never descendants of that root. Consumers
still provide semantic state such as `aria-current` or `aria-pressed`; visual
active state is not a substitute.

`SidebarShortcutHint` always occupies its trailing lane. It is visually hidden
and `aria-hidden` until Control/Meta is held, then fades in. Pressing or
releasing the modifier cannot change the title width. The ChatGPT consumer uses
`Ctrl + Shift + O`; shortcut rendering is reusable and product action handling
remains outside the primitive.

## Section contract

Sections use explicit pieces instead of boolean interpretation:

```tsx
<SidebarSection open={open} onOpenChange={setOpen}>
  <SidebarSectionHeader>
    <SidebarSectionTrigger>项目</SidebarSectionTrigger>
    <SidebarSectionActions>{/* add / more */}</SidebarSectionActions>
  </SidebarSectionHeader>
  <SidebarSectionContent>{/* rows */}</SidebarSectionContent>
</SidebarSection>
```

The trigger is a button with stable `aria-expanded`/`aria-controls`; a
non-interactive label uses `SidebarSectionLabel`. Header actions reserve their
space and follow the same reveal rules as menu actions. Base UI Collapsible
owns disclosure behavior, while all dimensions and motion come from sidebar
tokens.

## Motion and reduced motion

Shell width and rail/panel opacity share one duration family. Row action,
shortcut, tooltip, and section fades use the fast duration. No feature file
hard-codes animation timings. When `prefers-reduced-motion: reduce` is active,
the root motion variables become `0ms`; Sheet and collapsible styling consume
those variables as well.

Transitions are limited to width, opacity, transform where disclosure needs
it, and colors. There are no decorative entrance animations.

## File boundaries

```text
src/components/sidebar/
  context.tsx       root state, context, modifier and focus registry
  shell.tsx         desktop shell, panel, mobile Sheet, inset
  layout.tsx        header, fixed top, scroll area, footer
  menu.tsx          menu, item, polymorphic button, actions, shortcut
  section.tsx       explicit collapsible section parts
  rail.tsx          compact rail regions and controls
  controls.tsx      icon button and triggers
  state.ts          pure cookie/shortcut/presentation helpers
  tokens.ts         public token types/defaults
  sidebar.css       geometry, states, motion, scrollbar
  index.ts          public exports only

src/components/chatgpt-sidebar-demo/
  index.tsx         feature composition
  project-row.tsx   project navigation and menus
  chat-row.tsx      chat links and actions
  dialogs.tsx       feature dialogs
  account-menu.tsx  feature account menu
  data.ts           fixture content
  model.ts          feature reducer and selectors
```

Pure files have no `"use client"`. The primitive layer does not import
ChatGPT icons, routes, model types, data, or feature actions. The obsolete
`src/components/chat-sidebar/` directory is deleted after migration.

## Verification contract

Node tests protect pure behavior: cookies, shortcut safety, held modifier
state, independent desktop/mobile transitions, effective focus handoff,
scrollbar/gutter token independence, deep-link selection, chat ordering,
reducer no-ops, and destructive selection integrity. Action-lane geometry is
owned by the always-mounted CSS grid and is verified in Chrome rather than by
a test-only pixel calculator.

Chrome is authoritative for DOM and layout:

- expand → collapse → expand keeps header/footer icon centres within 0.5px;
- hover, focus, active, and menu-open do not change title geometry;
- New Chat remains fixed while all later items scroll away;
- only the middle region scrolls and the footer remains visible;
- Control/Meta press/release and blur reveal/reset hints without touching
  editable fields;
- links and buttons have correct native semantics and no nested controls;
- inactive rail/panel layers are inert and absent from tab order;
- sections disclose correctly and portaled menus retain row/action state;
- long content and scrollbar appearance do not shift width;
- reduced motion removes visible transitions;
- the mobile Sheet opens, traps/restores focus, closes with Escape/overlay, and
  does not reuse desktop open state.

Required automated gates are `npm test`, `npm run lint`, `npm run typecheck`,
and `npm run build`.
