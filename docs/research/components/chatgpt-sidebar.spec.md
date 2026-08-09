# ChatGPT sidebar feature specification

Source: authenticated `https://chatgpt.com/` inspection on 2026-08-09.

The reusable architecture is defined in
`docs/superpowers/specs/2026-08-09-chat-sidebar-compound-redesign.md`. This
document defines only the ChatGPT feature composition and its acceptance
criteria.

## Feature composition

- `SidebarRoot`: desktop default open, persisted as
  `chatgpt_sidebar_state`, Primary+B toggle outside editable fields.
- `SidebarShell`: left-side, 260px expanded, 58.5px compact rail.
- `SidebarRail`: brand/open control, New Chat, Search, Pinned, recent history,
  flexible spacer, account control.
- `SidebarPanel`: Header, FixedTop, ScrollArea, Footer in that order.
- `SidebarHeader`: ChatGPT brand/home, Search, Close Sidebar.
- `SidebarFixedTop`: New Chat only.
- `SidebarScrollArea`: File Library, Scheduled, Plugins, More, Pinned section,
  Projects section, Chats section, and all history.
- `SidebarFooter`: account/avatar/plan plus account menu and app action.

All ChatGPT copy, icons, routes, fixture projects/chats, dialogs, account menu,
notifications, and reducer actions stay in the feature directory. The generic
sidebar has no knowledge of projects or conversations.

## Navigation and command semantics

- New Chat, Search, section toggles, pin, edit, options, and account actions are
  buttons.
- File Library, Scheduled, Plugins, Projects, Chats, and conversations are
  links. Demo-only unavailable destinations may point at stable local routes
  and announce their behavior, but they still use anchor semantics.
- A conversation title is the accessible name of its link. Pin/options controls
  are separately labelled sibling buttons.
- Current conversation/project links use `aria-current="page"`; visual active
  state follows that state.
- Icon-only controls have explicit `aria-label`; tooltips are supplemental.

## Visual tokens

| Token | Dark value | Light value |
| --- | --- | --- |
| sidebar surface | `#000` | `#fcfcfc` |
| foreground | `#fff` | `#0d0d0d` |
| muted foreground | `#afafaf` | `#8f8f8f` |
| row highlight | `rgb(255 255 255 / 10%)` | `rgb(0 0 0 / 7%)` |
| hairline border | `rgb(255 255 255 / 5%)` | `rgb(0 0 0 / 5%)` |
| expanded width | 260px | 260px |
| compact/header size | 58.5px | 58.5px |
| row/control height | 40.5px | 40.5px |
| row radius | 10px | 10px |
| row font | 15.75px/22.5px | 15.75px/22.5px |

Primitive defaults may use normalized rem tokens. The ChatGPT theme overrides
the shared variables where exact emulation matters; feature JSX does not repeat
arbitrary pixel utilities.

## Stable layout rules

- Expanded and compact header icons share one inline anchor.
- Expanded and compact footer avatars share one inline anchor.
- Changing state does not change element padding, margin, dimensions, or icon
  size; only shell width, label visibility, and layer opacity change.
- Menu and section action lanes remain reserved while hidden.
- Long labels truncate; revealing one or two actions, holding Ctrl/Meta, or
  opening a menu cannot change label start/end geometry.
- Hover, active, focus-visible, focus-within, and menu-open use the same row
  surface without translations or borders that change box size.

## Shortcut behavior

The New Chat row reserves a trailing hint lane for `Ctrl + Shift + O` (or the
platform-equivalent primary modifier rendering). The hint is visually hidden
until Control/Meta is held and clears on keyup, blur, pagehide, or hidden
visibility. It stays mounted and does not shift the title.

Modifier tracking does not prevent defaults. Sidebar Primary+B and any New Chat
shortcut do not run from input, textarea, select, or contenteditable targets,
do not run during composition/repeat, and do not mutate input selection/value.

## Scrolling and sections

Only `SidebarScrollArea` scrolls. Header, New Chat, and Footer remain fixed.
File Library and every later navigation item scroll away with sections/history.
A semantic section named Pinned belongs to the scroll area and does not gain
layout pinning from its name.

Pinned conversations form one continuous prefix in the conversation model.
Filtering, pin/unpin, archive, delete, and move-to-project operations cannot
duplicate a chat or leave a pinned chat after a regular chat. Projects and
Chats start expanded; Pinned may start collapsed when empty.

## Responsive behavior

- ≥768px: dual-layer rail/expanded desktop shell participates in page layout.
- <768px: desktop layers leave the interaction tree; the page trigger opens a
  modal Sheet containing the expanded panel.
- Mobile state is independent from the persisted desktop collapsed state.
- Sheet title/description are accessible, focus is trapped and restored, and
  Escape/overlay close the drawer.

## Acceptance matrix

1. Expand, collapse, and expand: top controls and footer avatar remain anchored.
2. Mouse and keyboard interaction: rows/actions never shift or overlap text.
3. Scroll a long history: only the middle area moves; New Chat and Footer stay.
4. Toggle every section: height changes naturally and the last row remains
   reachable above the footer.
5. Open project/chat menus: action lane stays visible and row highlight remains.
6. Hold/release Control and Meta; blur the window: shortcut hint appears and
   resets with no title movement or input interference.
7. Inspect DOM: navigation destinations are anchors, commands are buttons,
   there are no nested interactive elements, and all icon controls are named.
8. Inspect inactive desktop layer: `inert`, `aria-hidden`, no pointer events,
   and no tab stops.
9. Test 1440×900, 768×900, and 390×844; Footer always remains visible.
10. Enable reduced motion: final state is correct with no visible width/fade/
    disclosure animation.

## Out of scope

Real authentication, remote conversation/project persistence, actual ChatGPT
routes/APIs, upload functionality, and backend search are not implemented.
