# ChatGPT Sidebar: Test and Accessibility Audit

## Scope and baseline

This audit covers the uncommitted ChatGPT sidebar implementation in the primary
worktree at the time of review:

- `src/components/chat-sidebar/chat-sidebar.tsx`
- `src/components/chatgpt-sidebar-demo.tsx`
- `src/components/chatgpt-sidebar-demo/model.ts`
- `tests/chat-sidebar-state.test.ts`
- `tests/chatgpt-sidebar-model.test.ts`

`npm test` currently passes 12 Node built-in tests. That is a useful smoke
baseline, but it does **not** cover the requested pinned-prefix, held-modifier,
action-reservation, polymorphic-rendering, or DOM accessibility contracts.

The repository intentionally has no React DOM/JSDOM test harness. Keep the
Node runner for deterministic logic and make Chrome/manual acceptance the
authoritative layer for browser layout, focus, inertness, Base UI portals, and
reduced-motion rendering. Do not add a DOM test dependency just to assert
implementation classes or reproduce a browser accessibility tree poorly.

## TDD boundary and proposed helper API

Add pure TypeScript helpers only where they encode a user-visible invariant.
They must have no React, DOM, `window`, or CSS imports, so Node 26 can execute
them with the existing `--experimental-strip-types` setup.

### 1. Chat ordering and continuous pinned prefix

Add to `src/components/chatgpt-sidebar-demo/model.ts`, or preferably a sibling
`chat-list.ts` with types imported from the model:

```ts
export type VisibleChatGroups = {
  pinned: ChatGptSidebarChat[]
  regular: ChatGptSidebarChat[]
}

export function getVisibleChatGroups(
  chats: readonly ChatGptSidebarChat[],
  normalizedQuery: string,
): VisibleChatGroups

export function flattenVisibleChatGroups(
  groups: VisibleChatGroups,
): ChatGptSidebarChat[]
```

Contract: discard archived/non-matching chats, preserve each group’s original
relative order, and place *every* matching pinned chat before *every* matching
regular chat. The flattened result must contain each eligible chat exactly once.
This makes “pinned is a continuous prefix” a tested model rule rather than an
accident of two component filters. The rendered pinned group must remain before
the normal-history group, including after pin/unpin, search, archive, delete,
and move-to-project actions.

### 2. Modifier-held shortcut reveal and input safety

Extend `src/components/chat-sidebar/state.ts` with event-shaped types instead
of accepting real browser events:

```ts
export type SidebarModifierEvent = Pick<KeyboardEvent,
  "key" | "ctrlKey" | "metaKey" | "repeat"
>

export type SidebarModifierState = { modifierHeld: boolean }

export function getSidebarModifierHeld(
  event: SidebarModifierEvent,
): boolean

export function reduceSidebarModifierState(
  state: SidebarModifierState,
  event: SidebarModifierEvent | { type: "window-blur" },
): SidebarModifierState

export type SidebarTargetDescriptor = {
  tagName?: string
  isContentEditable?: boolean
  hasEditableAncestor?: boolean
}

export function isTextEntryTarget(target: SidebarTargetDescriptor): boolean

export function shouldHandleSidebarToggle(
  event: SidebarShortcutEvent & { target: SidebarTargetDescriptor },
  shortcut: string,
): boolean
```

`getSidebarModifierHeld` is true while either Ctrl or Meta is down. The
component listens to `keydown`, `keyup`, and `window.blur`; it adapts the
native `event.target` to `SidebarTargetDescriptor` (including
`closest("[contenteditable]")`) before calling the pure helper. The held state
only exposes shortcut hints/actions and must not call `preventDefault` for
Control/Meta alone. `shouldHandleSidebarToggle` must return false for `input`,
`textarea`, `select`, and `[contenteditable]` targets (including a descendant
of a contenteditable element); the explicit Ctrl/Meta+B toggle may continue
only outside text entry. This avoids hijacking browser/editor shortcuts and
stuck visible hints after alt-tab/window focus loss.

### 3. Desktop/mobile presentation separation

Put the viewport-independent model in `chat-sidebar/state.ts`:

```ts
export type SidebarPresentationState = {
  desktopOpen: boolean
  mobileOpen: boolean
}

export type SidebarPresentationAction =
  | { type: "set-desktop-open"; open: boolean }
  | { type: "set-mobile-open"; open: boolean }
  | { type: "toggle-desktop" }
  | { type: "toggle-mobile" }

export function reduceSidebarPresentationState(
  state: SidebarPresentationState,
  action: SidebarPresentationAction,
): SidebarPresentationState

export function getSidebarTriggerExpanded(
  state: SidebarPresentationState,
  isMobile: boolean,
): boolean
```

Neither desktop action may mutate `mobileOpen`, nor mobile action mutate
`desktopOpen`. A viewport change selects which surface is rendered; it does not
overwrite either preference. The sole synchronization exception should be a
deliberate close policy documented by the caller, not an implicit reducer side
effect.

### 4. Stable action reservation

Add a unitless layout helper (not a helper that returns Tailwind class names):

```ts
export type MenuActionReservationInput = {
  actionCount: number
  actionSizePx?: number
  gapPx?: number
  inlinePaddingPx?: number
  endInsetPx?: number
  safetyPx?: number
}

export function getMenuActionReservationPx(
  input: MenuActionReservationInput,
): number
```

It returns zero for no actions; otherwise it returns a deterministic inline-end
reservation that includes all action controls, gaps, container padding, end
inset, and a small text/action separation. For the current two 28px actions,
2px gap, 2px padding, 4px end inset, and 8px safety gap, the result is 74px.
The row uses this value whether the action overlay is hidden, hovered,
focus-within, or its dropdown is open. Expose it as a
`--sidebar-menu-action-reserved` CSS variable, and let `SidebarMenuButton` consume it; do not require
every product row to hand-author `pr-[4.75rem]`.

### 5. Polymorphic semantics

The implementation needs an explicit semantic API, not a button-shaped
component with consumers attempting to nest links or Base UI triggers in it.
Use the Base UI `render` convention already present in this repository:

```ts
type SidebarMenuButtonProps = {
  render?: React.ReactElement | ((props: React.ComponentProps<"button">) => React.ReactElement)
  // existing visual props
}
```

Default rendering is a `button type="button"`. A navigation destination renders
an anchor (for example `render={<Link href="/…" />}`); a dropdown/dialog trigger
renders the primitive’s supplied trigger element. The visual component must
forward `className`, data attributes, ref, disabled state, and event handlers
to that one interactive root. Menu actions remain sibling controls in the
`li`, never descendants of an anchor/button. This contract is best validated
in Chrome because the Node runner cannot render JSX or inspect nested
interactive content.

## Exact red-first Node tests

Add these assertions before implementation. Include the new test file(s) in
the explicit `package.json` `test` script; it currently names exactly three
files, so a new test will otherwise not run in CI.

### `tests/chat-sidebar-state.test.ts`

1. `modifier is held for Control and Meta and clears on keyup/blur`
   - keydown `{ key: "Control", ctrlKey: true, metaKey: false }` => held.
   - keydown `{ key: "Meta", ctrlKey: false, metaKey: true }` => held.
   - keyup with both modifier flags false and `{ type: "window-blur" }` => not
     held.
   - **Expected current failure:** no modifier-held state/helper exists.

2. `holding a modifier is non-destructive and does not toggle the sidebar`
   - reducing only Ctrl/Meta events cannot change either presentation-open
     value; the component-level event handler must not prevent default for
     those events.
   - **Expected current failure:** no separable held-state policy exists.

3. `shortcut toggling ignores editable targets`
   - Ctrl+B/Meta+B on an input, textarea, select, a contenteditable element,
     and a child of contenteditable => `false`; the same event on a plain div
     => `true`.
   - **Expected current failure:** `matchesSidebarShortcut` disregards target,
     and the global handler always prevents default/toggles.

4. `desktop and mobile transitions never overwrite each other`
   - desktop toggle retains mobile state; mobile toggle retains desktop state;
     `getSidebarTriggerExpanded` selects the correct state for each viewport.
   - **Expected current failure:** no pure state contract exposes or protects
     this behavior.

5. `action reservation includes hidden controls`
   - zero actions => 0; one and two actions match the documented arithmetic;
     invalid negative/non-finite counts throw or normalize to zero (choose and
     document one policy).
   - **Expected current failure:** reservation is caller CSS and has no helper.

Keep the existing cookie tests and add malformed percent-encoding, duplicate
cookie (first match wins), case-insensitive shortcut, and `keyboardShortcut =
null` coverage. Do not test `document.cookie` directly in Node.

### `tests/chatgpt-sidebar-model.test.ts`

1. `visible chats have a continuous pinned prefix`
   - pin chats at non-adjacent original indices; assert the flattened IDs are
     `[all matching pinned in original order, all matching regular in original
     order]`, and assert no `pinned` entry appears after a regular entry.
   - **Expected current failure:** selection lives in JSX; no reusable
     ordering/group helper exists.

2. `pin, unpin, archive, delete, and query preserve the prefix invariant`
   - after every reducer step, run `getVisibleChatGroups` and assert the
     invariant plus no duplicate/missing visible IDs.
   - **Expected current failure:** same absent helper; this catches a later
     regression where pinned and normal lists drift.

3. `archived chats cannot be returned in either group`
   - archive a pinned and a regular chat, then assert neither survives search
     or the flattened groups.

4. `selection integrity survives destructive actions`
   - delete/archive active chat clears `activeChatId`; delete active project
     clears `activeProjectId`; moving a chat does not delete it. (Two of these
     exist today; retain them and add the missing active-project assertion.)

5. `unknown IDs are safe no-ops`
   - toggle/move/rename/archive/delete unknown chat and project IDs; state must
     remain deeply equal. This prevents accidental selection/data corruption in
     delayed menu callbacks.

6. `create actions preserve immutability and uniqueness policy`
   - the model must either reject duplicate IDs or make duplicate semantics
     explicit. Assert original arrays/objects remain unchanged.

## Chrome/manual acceptance matrix

Run against the local sidebar route using Chrome at 1440×900, 768×900, and
390×844. Repeat keyboard checks with a screen reader’s virtual cursor disabled
so actual focus order is observed. Use Chrome DevTools’ Accessibility pane and
Rendering panel; there is no need to make visual screenshot assertions part of
the Node suite.

| Area | Acceptance checks |
| --- | --- |
| Desktop expanded/collapsed | One `nav` labelled “历史聊天记录”; expanded panel is exposed only when open, rail only when collapsed. Inactive layer has both `aria-hidden="true"` and `inert`, contains no tab stops, and cannot be clicked through. Toggle reports the desktop `aria-expanded` value. |
| Mobile | Hamburger remains reachable while sheet is closed; its `aria-expanded` follows `mobileOpen`, never desktop collapse. Sheet has an accessible title/description, traps focus, Escape/overlay close it, and focus returns to the opener. Desktop panel/rail are absent from the mobile tab order. |
| Text inputs and modifier reveal | Focus composer, search input, rename input, and a contenteditable fixture. Hold Ctrl and Meta separately: shortcut hints/actions reveal while held, clear on keyup and on window blur, and do not change input value, selection, submit behavior, or browser default. Ctrl/Meta+B does not toggle while those fields are focused; it toggles once from a non-editable target. |
| Pinned ordering | Pin three non-adjacent chats, then search, unpin, archive, delete, and move one. Every visible pinned chat appears in the one leading pinned run; no pinned chat duplicates in the normal run. Pinned and normal disclosure/focus behavior remains coherent. |
| Action reservation | For short and very long project/chat titles, compare default, hover, keyboard focus, and open dropdown. Text’s start/end/truncation position does not shift; action overlay cannot cover readable title text; dropdown-open controls remain visible and keyboard reachable. Test at 200% zoom too. |
| Polymorphism | Exercise default button, a Next Link rendered as the row root, dropdown trigger, and disabled control. Inspect DOM for zero nested interactive elements. Enter/Space behavior follows the native root (link navigation vs button activation); aria/data attributes and focus ring survive the render composition. |
| Sections | Every collapsible header is a button with `aria-expanded` and `aria-controls` pointing to a unique, existing region. Collapsed content is not tabbable/readable by accidental focus. Header actions have stable accessible names even when opacity-hidden. |
| Scroll/footer | With enough chats/projects to overflow, only `SidebarContent` scrolls; header and account footer remain fixed. Footer neither scrolls away nor overlays the last row. Sticky primary section has correct stacking/opaque background and does not cover focused items. Verify rail/footer at the bottom after collapse. |
| Motion | Enable `prefers-reduced-motion: reduce`; width, opacity, section, sheet, icon, tooltip, and action-reveal transitions have no visible animation while final state and focus behavior remain correct. Restore no-preference and verify normal animation does not leave either layer interactive during cross-fade. |

Use Axe/Chrome’s accessibility audit as a supplement, then manually resolve:

- all icon-only controls have non-empty accessible names;
- no duplicate landmark/name confusion between desktop, rail, and mobile
  branches;
- contrast and focus indicators pass on dark hover/active surfaces;
- no `aria-hidden` ancestor contains the focused element;
- no focusable descendant remains inside `[inert]` content; and
- live status messages announce mutations once without stealing focus.

## Current defects and risky edges

1. **Global Ctrl/Meta+B steals editable-field shortcuts.** The provider’s
   `keydown` listener calls `preventDefault()` and toggles without inspecting
   the event target. This conflicts with the stated input-safety requirement.

2. **Held-modifier reveal is absent.** The “Ctrl Shift O” hint is permanently
   rendered in the demo; there is no Ctrl/Meta down/up/blur state or reveal
   policy. It also disagrees with the provider’s actual default Ctrl/Meta+B
   shortcut, creating a misleading keyboard contract.

3. **Pinned-prefix behavior is duplicated in JSX and untested.** `pinnedChats`
   and `regularChats` are independently filtered in the demo. The current
   split happens to render pinned first, but there is no single invariant for
   ordering/filtering and no protection against future duplication or drift.

4. **Action reservation is consumer-specific and fragile.** Project/chat rows
   manually apply `pr-[4.75rem]`; other menu rows do not reserve space.
   Absolute action overlays can cover titles, and title geometry differs as
   controls appear/disappear.

5. **Menu rows are button-only.** `ChatSidebarMenuButton` cannot safely render
   a link or a primitive trigger while preserving one interactive root. This
   blocks the required polymorphic semantics and encourages invalid nesting.

6. **No reduced-motion implementation.** Transition classes/styles are applied
   throughout the sidebar, sheet, disclosure icon, action overlays, and brand;
   no `motion-reduce` alternative or media-query override is present.

7. **Desktop/mobile state has no explicit behavioral contract.** States are
   separate React values today, but resize, trigger selection, and persistence
   are not tested. A refactor could easily couple them or report the wrong
   `aria-expanded` value.

8. **Closed layers require browser verification.** The rail/panel use
   `aria-hidden` and `inert`, which is promising, but their cross-fade and
   absolute stacking require tab/click tests. The mobile sheet is portalled,
   so static source inspection cannot establish focus return or background
   isolation.

9. **Footer/scroll invariant is CSS-only.** The intended `min-h-0` flex
   layout exists, but no stress fixture verifies a long list, 200% zoom, sticky
   prefix, or focus scrolling to the final row without the footer obscuring it.

10. **Current Node command is opt-in by filename.** New tests are silently
    skipped unless `package.json` is updated; treat that script change as part
    of the first TDD commit.

## Recommended verification sequence

1. Add the failing pure-helper tests and update the explicit test command.
2. Implement the helpers/reducer contracts until `npm test` passes.
3. Implement component semantics, state wiring, and reduced-motion styles.
4. Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
5. Complete the Chrome matrix above at all three viewport sizes, normal and
   reduced motion, before accepting the refactor.
