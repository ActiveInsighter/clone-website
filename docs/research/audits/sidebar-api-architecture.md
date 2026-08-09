# Compound sidebar architecture audit

## Decision

Replace the current compatibility-shaped component with one product-neutral compound API. `SidebarRoot` is the single public state/provider boundary, backed by a private context; `SidebarShell` owns the desktop/mobile presentation; and the panel has exactly four ordered regions:

1. `SidebarHeader` — fixed
2. `SidebarFixedTop` — fixed and optional; all fixed/pinned rows form one continuous prefix
3. `SidebarScrollArea` — the only vertical scroll container
4. `SidebarFooter` — fixed

The desktop rail and expanded panel remain separate visual surfaces, but both consume one icon-anchor geometry token. The mobile presentation reuses the panel composition inside a Base UI-backed `Sheet`. Menu rows share one interaction state model, and `SidebarMenuButton` uses the installed `@base-ui/react/use-render` API so its actual element may be a button, anchor, Next `Link`, or a ref-forwarding custom control.

No compatibility facade should survive the rewrite. In particular, remove the `ChatSidebar*` names, the `src/components/chat-sidebar` implementation directory, and the alias-only `src/components/sidebar/index.ts` layer after consumers migrate.

## Audit scope and evidence

This audit uses the live, uncommitted files in the main workspace, not the older snapshot on this report branch:

- `src/components/chat-sidebar/chat-sidebar.tsx` — 871 lines
- `src/components/chat-sidebar/state.ts`
- `src/components/chat-sidebar/index.ts`
- `src/components/sidebar/index.ts`
- `src/components/chatgpt-sidebar-demo.tsx` — 1,023 lines

The installed dependency is `@base-ui/react@^1.3.0`. Its public `@base-ui/react/use-render` entry point accepts a default tag, a React element or render function, state-to-data-attribute mapping, merged props, and merged refs. Next 16.3's `Link` renders an anchor and accepts anchor props/ref, so it is a good `render={<Link href="..." />}` target.

## Root causes

| Area | Current symptom | Root cause | Replacement |
| --- | --- | --- | --- |
| Public boundary | `ChatSidebarProvider` and `ChatSidebarRoot` are both public, while `SidebarRoot` is an alias of the latter. | The API grew by wrapping and aliasing rather than choosing one ownership boundary. | One public `SidebarRoot`; its implementation provides context and the tooltip provider. |
| Product neutrality | Generic exports still originate in a `chat-sidebar` module, and the demo adds ChatGPT-specific spacing overrides everywhere. | Naming and geometry were extracted after the product component existed. | Product-neutral files and tokens first; ChatGPT data, icons, reducers, dialogs, notices, and row menus remain in a feature/demo directory. |
| Controlled state | In controlled mode, `setOpen` calls the owner but never persists the accepted value; only the uncontrolled branch writes a cookie (lines 118–130). | Persistence is coupled to the setter implementation rather than effective state. | A controllable-state hook plus an effect that persists the effective desktop state in both modes. |
| Initial state | The cookie is read in an effect after first paint (lines 112–116). | A client-only read cannot agree with server markup. | Pass `defaultOpen` from the server cookie when a no-flash initial state matters; never repair initial state after paint. |
| Mobile state | Desktop is controllable but `openMobile` is always internal (lines 107–110). | The responsive branch was treated as an implementation exception. | Independent `mobileOpen`, `defaultMobileOpen`, and `onMobileOpenChange`; mobile state is not persisted by default. |
| Responsive semantics | The same `...props` are spread onto a desktop `div` and a mobile Sheet popup (lines 221–261). A consumer's `role="navigation"` can replace dialog semantics on mobile. | One intrinsic-prop type is being used for two different semantic elements. | `SidebarShell` owns the dialog; `SidebarPanel` owns navigation semantics. Shell and panel props are distinct. |
| Rail interaction | The entire rail layer is a clickable `div` that expands the sidebar (lines 265–279), while nested rail buttons stop propagation manually (lines 773–777). | A background hit target is substituting for an explicit control. | Explicit rail trigger/button; no click handler on the rail container and no propagation workaround. |
| Stable anchors | Rail buttons are centered in `--chat-sidebar-rail-width`, while expanded rows derive icon position from unrelated margins/padding (lines 725, 768 versus 576). Defaults already disagree (`52px` rail versus expanded icon center near `28px`), and the demo changes the rail to `59px`. | Rail and panel geometry are duplicated rather than derived. | Both surfaces position the icon wrapper at `--sidebar-icon-anchor-inline`, derived from one rail-width token. Geometry is regression-tested. |
| Fixed/scroll layout | Any section may opt into `sticky` inside the scroll container (lines 355–382). Multiple or non-prefix sticky sections can overlap and fragment scrolling. | Fixed placement is an item option instead of a structural region. | Remove `sticky`. A single `SidebarFixedTop` precedes one `SidebarScrollArea`; structure makes the invariant unavoidable. |
| Scrollbar | The only scroll container hides all scrollbars (lines 319–331). | Width stability was achieved by removing the affordance. | `scrollbar-gutter: stable`, a thin visible scrollbar, and `overflow-y: scroll` fallback where the gutter is unsupported. |
| Row states | Active, menu-open, hover, focus, and action visibility are styled by different elements. The demo folds `menuOpen` into `isActive` and manually passes `open` to `SidebarMenuActions` (demo lines 210–262 and 290–370). | Visual state is consumer-coordinated and duplicated. | The menu item owns the row surface. `active` is explicit; menu-open is detected from the accessible trigger's `aria-expanded="true"`; hover/focus-within/open/active all set the same highlight token. |
| Element polymorphism | `SidebarMenuButton` always emits a native button (lines 557–590), so navigation uses click handlers or bespoke markup. | The primitive chose an element too early. | `useRender` with default `button`; target-specific props live on the supplied render element. |
| Shortcut hint | The New Chat shortcut is always mounted and visible (demo lines 770–785), while provider shortcut logic knows only key matching. | Modifier visibility and shortcut execution are unrelated one-off implementations. | Root tracks primary-modifier state; `SidebarShortcutHint` always reserves its lane but is visible only while Ctrl/Meta is held. |
| Keyboard safety | Shortcut matching checks only key plus Ctrl/Meta. It does not reject repeats, composition, editable targets, Alt, or an already-handled event. | The pure matcher is too small to represent a global application shortcut. | A normalized shortcut policy and an editable-target guard; reset modifier state on keyup, blur, page hide, and hidden visibility. |
| Motion | Shell width uses provider duration/easing, while fades, sections, and Sheet use separate hardcoded 100/150/200ms values; reduced motion is absent. | Motion tokens are local implementation details. | One motion token family consumed by shell, rail/panel fade, sections, tooltips, and Sheet; reduced-motion overrides tokens at the root. |
| Focus and inert | Clicking the expanded header trigger collapses and immediately makes its still-focused ancestor inert (lines 282–289). The two cross-faded surfaces have no focus handoff. | Visibility state changes without a focus destination contract. | Register a visible trigger per surface and move focus before/after the active surface becomes inert. Keep `aria-hidden`, `inert`, pointer state, and opacity driven by the same state. |
| Section API | `label`, `collapsible`, `action`, and content are all interpreted by one component; a non-collapsible label is a hover-styled `div` (lines 355–498). | Boolean props are selecting unrelated semantic structures. | Explicit `SidebarSectionHeader`, `SidebarSectionLabel`, `SidebarSectionTrigger`, `SidebarSectionActions`, and `SidebarSectionContent`. |
| File responsibility | Provider, persistence, responsive Sheet, panel layout, section, menu, rail, trigger, tooltip, and inset are in one 871-line client file. | The module is organized by historical accumulation, not dependency direction. | Split by state, shell, layout, section, menu, rail, and tooltip responsibility. |

## Architectural invariants

The implementation should make these rules structural rather than relying on documentation:

- There is one state owner (`SidebarRoot`) and one private context.
- Desktop expansion and mobile drawer visibility are independent controllable states.
- Cookie persistence applies only to effective desktop expansion state.
- Desktop has exactly one active navigation surface: expanded panel or rail. The inactive surface is `aria-hidden`, inert, non-interactive, and visually hidden.
- Mobile uses Sheet/Dialog semantics. The navigation landmark is inside the popup and never replaces the popup role.
- The panel's fixed regions are contiguous. No descendant primitive exposes `sticky`.
- The panel contains exactly one vertical scroll area.
- Rail and expanded-row icon centers resolve to the same physical inline coordinate.
- Menu row hover, keyboard focus, current/active state, and open child menu use the same row background and foreground tokens.
- Hidden actions remain keyboard discoverable: focusing an action reveals the action lane. Portaled menu-open state keeps it visible through `aria-expanded`.
- Shortcut text never enters/leaves layout when the modifier changes.
- Product models and actions never enter primitive props or context.

## Proposed public API

Use named exports. A namespace object can be added for documentation ergonomics, but the canonical tree-shakeable API should remain named exports.

### State boundary

```tsx
type SidebarChangeReason =
  | "trigger"
  | "shortcut"
  | "escape"
  | "outside-press"
  | "programmatic"

type SidebarChangeDetails = {
  reason: SidebarChangeReason
  event?: Event
}

type SidebarShortcut = {
  key: string
  modifier: "primary" // Meta on macOS, Control elsewhere; either is accepted
}

type SidebarCookieOptions = {
  name: string
  maxAge?: number
  path?: string
  sameSite?: "lax" | "strict" | "none"
  secure?: boolean
}

type SidebarRootProps = React.ComponentPropsWithoutRef<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: SidebarChangeDetails) => void

  mobileOpen?: boolean
  defaultMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean, details: SidebarChangeDetails) => void

  shortcut?: SidebarShortcut | null
  persistence?: SidebarCookieOptions | false
}

function SidebarRoot(props: SidebarRootProps): React.ReactElement

type SidebarContextValue = {
  state: "expanded" | "collapsed"
  open: boolean
  mobileOpen: boolean
  isMobile: boolean
  primaryModifierHeld: boolean
  setOpen(open: boolean, details?: SidebarChangeDetails): void
  setMobileOpen(open: boolean, details?: SidebarChangeDetails): void
  toggle(details?: SidebarChangeDetails): void
  openSidebar(details?: SidebarChangeDetails): void
  closeSidebar(details?: SidebarChangeDetails): void
}

function useSidebar(): SidebarContextValue
```

`SidebarRoot` is the provider; do not export a second `SidebarProvider` with overlapping responsibility. The context itself stays private so invariants cannot be bypassed. `useSidebar` is public for application controls outside the shell.

The default shortcut remains Primary+B. The listener must ignore `event.defaultPrevented`, `event.repeat`, `event.isComposing`, Alt-modified input, and editable targets (`input`, `textarea`, `select`, and contenteditable). It should use `window.matchMedia` at event time to choose desktop versus mobile rather than depending on a possibly stale first-render `isMobile` value.

### Shell and layout

```tsx
<SidebarRoot
  defaultOpen={initialSidebarOpen}
  persistence={{ name: "chatgpt_sidebar_state", maxAge: 604800 }}
  style={sidebarTheme}
>
  <SidebarShell side="left" label="Conversation history">
    <SidebarRail aria-label="Quick navigation">
      <SidebarRailHeader>{/* compact brand/trigger */}</SidebarRailHeader>
      <SidebarRailMenu>{/* compact destinations */}</SidebarRailMenu>
      <SidebarRailFooter>{/* compact account */}</SidebarRailFooter>
    </SidebarRail>

    <SidebarPanel>
      <SidebarHeader>{/* brand, search, close trigger */}</SidebarHeader>

      <SidebarFixedTop>
        {/* New Chat and any other deliberately fixed rows, as one prefix */}
      </SidebarFixedTop>

      <SidebarScrollArea>
        {/* Library, projects, semantic “Pinned chats”, chat history, etc. */}
      </SidebarScrollArea>

      <SidebarFooter>{/* account and app actions */}</SidebarFooter>
    </SidebarPanel>
  </SidebarShell>

  <SidebarInset>{/* application content */}</SidebarInset>
</SidebarRoot>
```

`SidebarShell` accepts only shell concerns: `side`, required accessible `label`, class names for the desktop container and Sheet popup/overlay if necessary, and its children. It owns stable IDs for the shell, panel, and Sheet. `SidebarPanel` renders the navigation landmark. On mobile, the Shell supplies the accessible Sheet title from `label` and places `SidebarPanel` inside the dialog.

`SidebarFixedTop` is optional but singular. The implementation can validate duplicate layout regions in development. A semantic application section named “Pinned” is not automatically fixed; it belongs in `SidebarScrollArea` unless the product intentionally makes it part of the continuous fixed prefix.

### Sections

```tsx
<SidebarSection open={projectsOpen} onOpenChange={setProjectsOpen}>
  <SidebarSectionHeader>
    <SidebarSectionTrigger>Projects</SidebarSectionTrigger>
    <SidebarSectionActions>{/* create / more */}</SidebarSectionActions>
  </SidebarSectionHeader>
  <SidebarSectionContent>
    <SidebarMenu>{/* rows */}</SidebarMenu>
  </SidebarSectionContent>
</SidebarSection>

<SidebarSection>
  <SidebarSectionHeader>
    <SidebarSectionLabel>Library</SidebarSectionLabel>
  </SidebarSectionHeader>
  {/* non-collapsible content */}
</SidebarSection>
```

`SidebarSection` uses Base UI Collapsible only when a `SidebarSectionTrigger` is present. The trigger owns `aria-expanded` and `aria-controls`; the label is non-interactive and has no hover/focus treatment. The content may stay mounted for measurement and state preservation, but must be hidden from assistive technology when closed.

### Menu row and polymorphic button

```tsx
<SidebarMenuItem active={pathname === "/library"}>
  <SidebarMenuButton
    render={<Link href="/library" />}
    icon={<LibraryIcon />}
    aria-current={pathname === "/library" ? "page" : undefined}
  >
    Library
  </SidebarMenuButton>
</SidebarMenuItem>

<SidebarMenuItem>
  <SidebarMenuButton
    render={<a href="https://example.com/help" target="_blank" rel="noreferrer" />}
    icon={<HelpIcon />}
  >
    Help
  </SidebarMenuButton>
</SidebarMenuItem>

<SidebarMenuItem>
  <SidebarMenuButton icon={<ComposeIcon />} onClick={createChat}>
    New chat
  </SidebarMenuButton>
</SidebarMenuItem>

<SidebarMenuItem>
  <SidebarMenuButton render={<ForwardRefCustomControl destination={item} />}>
    Custom destination
  </SidebarMenuButton>
</SidebarMenuItem>
```

Recommended type and implementation seam:

```tsx
type SidebarMenuButtonState = {
  active: boolean
  disabled: boolean
}

type SidebarMenuButtonProps = Omit<
  useRender.ComponentProps<"button", SidebarMenuButtonState>,
  "children"
> & {
  active?: boolean
  icon?: React.ReactNode
  trailing?: React.ReactNode
  children: React.ReactNode
}

const element = useRender<SidebarMenuButtonState, HTMLElement>({
  defaultTagName: "button",
  render,
  ref,
  state: { active, disabled },
  props: {
    type: render ? undefined : "button",
    className: menuButtonClassName,
    children: composedIconLabelAndTrailingSlots,
    ...elementProps,
  },
})
```

This is preferable to a generic `as` prop or an `asChild` clone because it:

- is already installed and used by the project's Base UI primitives;
- merges internal/external event handlers, class names, styles, and refs consistently;
- keeps `href`, `prefetch`, `target`, and custom props on the element that understands them;
- supports a render function when a custom element needs component state;
- avoids a combinatorial polymorphic TypeScript API.

Requirements for a custom rendered component: forward the ref to the interactive DOM element, spread the received DOM props, and do not emit a second interactive element. The primitive must set `type="button"` only for its default native button. Active styling is not a semantic substitute: links still receive `aria-current`, while toggle buttons receive the appropriate `aria-pressed` from the consumer.

### Unified row states and actions

`SidebarMenuItem` owns the row highlight surface. Its CSS state set is:

```css
[data-slot="sidebar-menu-item"]:is(
  :hover,
  :focus-within,
  [data-active],
  :has([aria-expanded="true"])
)::before {
  background: var(--sidebar-row-highlight);
}
```

The button and action controls sit above that shared pseudo-element and use transparent backgrounds except for a direct action hover/focus affordance. `SidebarMenuActions` is always mounted. It is visually hidden until row hover, row focus-within, or a descendant trigger has `aria-expanded="true"`; keyboard focus must reveal it. This removes the demo's duplicated `menuOpen` → `isActive` and `menuOpen` → `MenuActions.open` plumbing. The accessible menu trigger is the source of truth even while focus is in a portaled popup.

The item reserves its action lane whenever actions are present. Menu actions may fade, but their appearance never changes the label's measured width.

### Shortcut hint

```tsx
<SidebarMenuButton icon={<ComposeIcon />} onClick={createChat}>
  New chat
  <SidebarShortcutHint keys={["Shift", "O"]} />
</SidebarMenuButton>
```

`SidebarShortcutHint` reads `primaryModifierHeld` and platform presentation from context. The wrapper always occupies the trailing grid lane. When the modifier is not held it uses `visibility: hidden`, `opacity: 0`, and `aria-hidden="true"`; when held it becomes visible without mounting, unmounting, or changing grid tracks. The hint can render `⌘⇧O` on macOS and `Ctrl Shift O` elsewhere, but the consumer owns the product action and the actual New Chat keyboard handler.

Root's modifier tracker listens for Control/Meta keydown and keyup and clears on `window.blur`, `pagehide`, and `document.visibilitychange`. This prevents a stuck hint after an OS-level shortcut or tab switch.

### Tooltip

Keep `SidebarTooltip` as a small public composition primitive and keep `tooltip` convenience props on icon-only, rail, section-action, and trigger controls. Do not also set `title` when an interactive tooltip is rendered; that creates duplicate browser and custom tooltips. Icon-only controls require an accessible name independently of the tooltip. Tooltips are suppressed for inert/hidden surfaces and while a mobile Sheet is closed.

## State and data flow

| Input/event | Owner | Transition | Side effects |
| --- | --- | --- | --- |
| Server cookie | Server page/layout | Parsed to `defaultOpen` before client render | No hydration correction or first-paint width jump |
| Desktop `open` prop | Application | Effective state is prop value | `onOpenChange` is a request; accepted effective value is persisted |
| Uncontrolled desktop trigger | Root | Updates internal `open` | Persists cookie and hands focus to the becoming-visible surface |
| Mobile trigger | Root | Updates independent `mobileOpen` | Sheet manages modal focus/escape/outside press; no desktop cookie write |
| Primary+B | Root global listener | Toggles desktop or mobile based on live media query | Prevent default only after all shortcut guards pass |
| Control/Meta held | Root modifier tracker | Updates ephemeral `primaryModifierHeld` | Shortcut hints fade only; no layout or persistence change |
| Section trigger | Section/Collapsible | Controlled or uncontrolled section state | No root state and no product model mutation |
| Menu trigger | Menu library | Updates `aria-expanded` | Row/action styling follows the trigger attribute |
| Chat/project actions | ChatGPT feature | Reducer/router/server mutation | Primitive receives only nodes, handlers, and presentation state |

Cookie persistence defaults should be `path=/`, `maxAge=604800`, and `sameSite=lax`; `secure` is configurable so local HTTP development still works. Encode names/values defensively. The cookie is a UI preference and cannot be `HttpOnly` when client changes write it.

For Next 16, a no-flash bootstrap can be supplied by a Server Component:

```tsx
const cookieStore = await cookies()
const initialSidebarOpen =
  cookieStore.get("chatgpt_sidebar_state")?.value !== "false"

return <ClientShell initialSidebarOpen={initialSidebarOpen} />
```

`cookies()` is a request-time API and opts that route into dynamic behavior; document that tradeoff. Static routes may intentionally accept the default state on first load and persist only subsequent visits through a different bootstrap strategy.

## CSS token contract

Move all reusable geometry, color, and motion values to the root contract. Product themes override variables; component classes consume them and do not repeat arbitrary pixel values.

```css
[data-slot="sidebar-root"] {
  /* geometry */
  --sidebar-width: 16.25rem;
  --sidebar-rail-width: 3.6875rem;
  --sidebar-header-height: 3.6875rem;
  --sidebar-row-height: 2.53125rem;
  --sidebar-row-radius: 0.625rem;
  --sidebar-edge-padding: 0.5625rem;
  --sidebar-icon-size: 1.25rem;
  --sidebar-action-size: 1.75rem;
  --sidebar-action-gap: 0.125rem;
  --sidebar-icon-anchor-inline: calc(var(--sidebar-rail-width) / 2);
  --sidebar-scrollbar-size: 0.5rem;

  /* color */
  --sidebar-surface: #fcfcfc;
  --sidebar-foreground: #0d0d0d;
  --sidebar-muted-foreground: #8f8f8f;
  --sidebar-row-highlight: rgb(0 0 0 / 7%);
  --sidebar-border: rgb(0 0 0 / 5%);
  --sidebar-border-strong: rgb(0 0 0 / 15%);
  --sidebar-focus-ring: oklch(0.708 0 0);
  --sidebar-overlay: rgb(0 0 0 / 50%);
  --sidebar-shadow: 0 0 4rem rgb(0 0 0 / 7%);

  /* motion */
  --sidebar-motion-duration: 250ms;
  --sidebar-motion-fast-duration: 150ms;
  --sidebar-motion-easing: cubic-bezier(0.32, 0.72, 0, 1);
  --sidebar-motion-fade-easing: linear;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="sidebar-root"] {
    --sidebar-motion-duration: 0ms;
    --sidebar-motion-fast-duration: 0ms;
  }
}
```

The existing Tailwind theme aliases may map to these variables. Rename or remove duplicate `--chat-sidebar-*` and hardcoded 100/150/200/250ms values. The Sheet popup and backdrop must consume the same duration/easing variables.

To guarantee the icon anchor, every row icon uses a fixed wrapper whose center is `--sidebar-icon-anchor-inline` from the Shell's physical inline edge. Rail buttons use that same coordinate rather than merely `justify-center` in an independently sized rail. Test left and right/RTL variants.

The scroll area should use:

```css
[data-slot="sidebar-scroll-area"] {
  min-block-size: 0;
  overflow-x: clip;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--sidebar-foreground) 20%, transparent)
    transparent;
}

@supports not (scrollbar-gutter: stable) {
  [data-slot="sidebar-scroll-area"] {
    overflow-y: scroll;
  }
}
```

Do not use `scrollbar-width: none` or hide WebKit scrollbars. Stable gutter protects the row width while preserving a discoverable scrolling affordance.

## Focus, aria, and inert contract

- `SidebarShell` has a stable ID; triggers receive `aria-controls` for the currently relevant panel and accurate `aria-expanded`.
- Expanded `SidebarPanel` and collapsed `SidebarRail` are distinct labelled navigation landmarks, but only one is exposed at a time.
- The inactive desktop surface receives `inert`, `aria-hidden="true"`, and no pointer events before it can be focused. The active surface receives none of those attributes.
- When collapsing from a focused control inside the panel, focus moves to the registered rail trigger before/at inert activation. When expanding from the rail trigger, focus moves to the registered panel trigger only when the action was explicitly a toggle; programmatic expansion should not steal focus.
- Mobile Sheet remains a dialog with Base UI focus trapping, escape handling, outside-press handling, focus restoration, title, and description. The panel navigation landmark is a descendant.
- Section trigger/content IDs are stable across render and breakpoint changes.
- `SidebarMenu`/`SidebarMenuItem` remain `ul`/`li`; the actual interactive descendant is rendered by `SidebarMenuButton`.
- Do not infer aria semantics from visual `active`. The consumer supplies `aria-current`, `aria-pressed`, or selection semantics appropriate to its domain.
- Disabled controls use native `disabled` when the rendered element supports it, otherwise `aria-disabled` plus prevented activation and an explicit focus policy.
- Tooltip content never replaces an accessible name.

## File map and dependency direction

```text
src/components/sidebar/
  index.ts                    public named exports and public types only
  sidebar-types.ts            shared public types; no React state
  sidebar-state.ts            pure cookie/shortcut guards and serializers
  sidebar-context.tsx         SidebarRoot, controllable state, modifier/focus registry, useSidebar
  sidebar-shell.tsx           SidebarShell, responsive Sheet, SidebarPanel, SidebarInset
  sidebar-layout.tsx          Header, FixedTop, ScrollArea, Footer
  sidebar-section.tsx         Section compound parts backed by Base UI Collapsible
  sidebar-menu.tsx            Menu, Item, MenuButton/useRender, Actions, ShortcutHint
  sidebar-rail.tsx            Rail, RailHeader, RailMenu, RailFooter, RailButton
  sidebar-controls.tsx        Trigger, IconButton, SectionAction
  sidebar-tooltip.tsx         Tooltip provider/composition helpers
  sidebar.css                 token defaults, state selectors, reduced motion, scrollbar rules

src/components/chatgpt-sidebar-demo/
  index.tsx                   ChatGPT composition only
  chat-history-row.tsx        chat menu/actions
  project-row.tsx             project menu/actions
  account-menu.tsx            account product menu
  dialogs.tsx                 search/edit dialogs
  data.ts                     fixture content
  model.ts                    reducer and product types
```

Dependency direction is `chatgpt-sidebar-demo/*` → `components/sidebar`; sidebar primitives must never import the ChatGPT config, model, icons, dialogs, Next router, or feature actions. The sidebar may depend on Base UI/shadcn wrappers, `cn`, the media hook, and React only.

The client boundary can remain per implementation file. Pure types/state helpers should not carry `"use client"`, which keeps cookie parsing and shortcut guards unit-testable from Node and usable by server code.

## Migration shape

1. Create the new `src/components/sidebar` implementation directly; do not move the 871-line file wholesale or retain aliases.
2. Introduce `SidebarRoot` with independent controlled/uncontrolled desktop and mobile state. Move pure cookie and shortcut helpers first.
3. Add `SidebarShell`, `SidebarRail`, and `SidebarPanel`, then enforce the shared icon anchor and focus registration before moving menu content.
4. Replace `SidebarContent` plus `SidebarSection sticky` with `SidebarFixedTop` and `SidebarScrollArea`. Move New Chat into `FixedTop`; keep Library, projects, pinned-chat content, and chat history in the shared scroll area.
5. Replace boolean section composition with explicit section compound parts.
6. Move row highlighting to `SidebarMenuItem`, convert menu triggers to accessible `aria-expanded` sources, and delete the demo's `isActive={active || menuOpen}`, `MenuActions open`, and padding overrides.
7. Convert destinations to semantic elements: default buttons for commands, `render={<a ... />}` for external links, and `render={<Link ... />}` for Next routes.
8. Add `SidebarShortcutHint`; keep the New Chat command listener in the ChatGPT feature.
9. Split the ChatGPT demo by product responsibility and keep reducer/data/dialog imports out of the primitive directory.
10. Delete `src/components/chat-sidebar`, remove the alias barrel, and update all imports in one breaking change.

Because compatibility is explicitly not required, avoid deprecation aliases, dual prop names, and adapters. They would preserve the exact ambiguity this rewrite is meant to remove.

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Server cookie bootstrap makes a Next route request-time/dynamic | Performance/caching behavior can change. | Make server bootstrap opt-in and document the tradeoff; do not hide an effect-based flash inside Root. |
| Focus moves while width/fade transitions run | Focus can land in an inert or zero-opacity surface. | Register both surface triggers; order focus handoff and inert update deliberately; test mouse, keyboard, and programmatic transitions. |
| Base UI `render` misuse by custom controls | Lost props/ref or nested interaction breaks keyboard/menu behavior. | Document forwardRef/spread contract, add type examples, and component-test button, anchor, Next Link, and a custom control. |
| `:has([aria-expanded])` baseline | Very old browsers may not keep menu-open styling. | Target evergreen browser support or add an explicit item `menuOpen` escape hatch only if support requirements demand it. Do not duplicate state pre-emptively. |
| Responsive breakpoint disagreement between CSS and JS | Hidden desktop surface and mobile state can diverge. | Export one `SIDEBAR_MOBILE_QUERY` constant and mirror one documented CSS breakpoint; test at the exact boundary. Do not offer a CSS-variable breakpoint because variables cannot drive media queries. |
| Sheet and desktop trees switch at hydration/breakpoint | Local uncontrolled descendant state may reset. | Keep product state above Shell and make meaningful section/menu state controlled; avoid storing business state inside responsive presentation components. |
| Stable icon geometry regresses during theme overrides | Visual jump returns despite correct state logic. | Derive both surfaces from one anchor token and test `getBoundingClientRect().x + width/2` before/after collapse within 0.5px. |
| Visible scrollbar changes the visual clone | Slight appearance difference from the hidden-scrollbar version. | Use a thin themed scrollbar and stable gutter; accessibility and no-width-shift are hard requirements. |
| Menu popup is portaled | `focus-within` alone cannot retain row/action state. | Use the trigger's persistent `aria-expanded="true"` in the row selector. |
| Right-side/RTL layouts | Physical-left assumptions break anchors, cursor, borders, or Sheet motion. | Use logical inline properties and test left/right in both LTR and RTL. |
| Controlled owner rejects an open request | Cookie could persist a value the UI never accepted. | Persist effective `open`, not the requested next value. |
| Modifier keyup is lost to OS/tab switch | Shortcut hint remains visible. | Clear on blur, pagehide, and hidden visibility in addition to keyup. |

## Verification gates

Before the rewrite is considered complete:

- Unit-test controllable state, cookie parsing/serialization, editable-target guards, exact modifiers, repeat/composition rejection, and modifier reset.
- Component-test native button, anchor, Next Link, custom render element, disabled behavior, merged handlers, and ref forwarding.
- Component-test controlled/uncontrolled desktop and mobile states independently, including a controlled owner that rejects a request.
- Run keyboard focus sequences for expand, collapse, Sheet open/close, escape, section toggles, row actions, and portaled menus; assert no focused element is inside an inert subtree.
- Assert only one exposed navigation surface and one vertical scroll container at every state/breakpoint.
- Measure rail versus panel icon centers before and after transition; tolerance ≤ 0.5px.
- Assert title bounding box does not move when Control/Meta is pressed or released.
- Assert row width does not change when content begins overflowing and the scrollbar appears.
- Verify `prefers-reduced-motion: reduce` yields no width, fade, section, tooltip, or Sheet animation.
- Run axe plus desktop/mobile visual regression in light/dark, left/right, LTR/RTL, hover, active, focus-visible, and menu-open states.

## Key implementation choices

- `SidebarRoot` is the provider; context is private, `useSidebar` is public.
- The fixed prefix is a layout region, not a `sticky` option.
- One scroll area, stable visible scrollbar gutter.
- One icon anchor token for both desktop surfaces.
- One row highlight surface for hover, focus, active, and menu-open.
- `@base-ui/react/use-render` is the polymorphism mechanism.
- Effective state, not requested state, is persisted.
- Initial cookie state comes from the server when no-flash rendering is required.
- Modifier hint occupies a permanent trailing lane and only changes visibility.
- ChatGPT state/data/actions remain above the primitive boundary.
