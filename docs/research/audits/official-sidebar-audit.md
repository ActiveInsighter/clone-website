# Official ChatGPT sidebar audit

Observed 2026-08-09 in the user's authenticated Chrome session at `https://chatgpt.com/`, dark theme, Chinese UI. Values below are computed CSS pixels at an explicit `1440 x 900` viewport. The page root computed to `18px`; this matters because several Tailwind/rem values resolve to quarter-pixel multiples.

## Verified desktop geometry and tokens

| Item | Official computed result |
| --- | --- |
| Expanded panel | `260 x 900`; black `rgb(0 0 0)` surface |
| Collapsed rail layer | `58.5 x 900`; absolute at `x=0`; collapsed state `opacity:1`, `pointer-events:auto`; expanded state `opacity:0`, `pointer-events:none` |
| Rail transition | `opacity 150ms steps(1)` (`steps(1,start)` when visible, `steps(1,end)` when hidden) |
| Expanded panel layer | remains a `260px`-wide DOM box when collapsed, but becomes `opacity:0` and `pointer-events:none`; computed opacity transition `150ms linear` |
| Header | sticky, `58.5px` high, black, `z-index:30` |
| Search / close / open controls | `40.5 x 40.5`, `9px` radius, tertiary `rgb(175 175 175)`; desktop expanded search at `x=158.60`, close at `x=199.10`, both `y=9` |
| Primary row | `231.64 x 40.5`, horizontal margins `6.75px`, padding `6.75px 11.25px`, radius `10px`, `15.75px / 22.5px`, gap `6.75px` (new chat uses `9px`) |
| Text/surface | body system stack (`-apple-system-body`, `ui-sans-serif`, system UI fallbacks); foreground white; tertiary `rgb(175 175 175)`; active/hover sample `rgba(255 255 255 / 0.1)` |
| Collapsed content layout | open control at `(9,9)` and `40.5px` square; compact rail width `58.5px`; main content began at `x=73.36` in this route/layout |

The official desktop DOM keeps two sibling/layered navigation surfaces: `<nav aria-label="侧边栏">` for the compact rail and `<nav aria-label="历史聊天记录">` for the expanded scrollport. The rail is not conditionally removed; opacity and pointer-events switch the active layer. The expanded close control exposes `aria-expanded="true"`; the collapsed open control has the direct accessible label `打开边栏`.

## Scroll topology with long history

At `1440 x 900`, the official `<nav aria-label="历史聊天记录">` was the only element whose content actually overflowed:

- bounding box `260 x 826.14`, `clientHeight=826`, `scrollHeight=1827`, initial `scrollTop=0`;
- `overflow-y:auto`; `clientWidth=245` inside the `260px` box, leaving an approximately `15px` native scrollbar gutter;
- top header is sticky at `top:0`, `z-index:30`; the primary/new-chat block immediately below is independently sticky at `top:58.5px`, `z-index:20`, with `9px` top padding;
- the account/profile footer is a flex sibling outside that history scrollport, so it remains pinned while history scrolls;
- a visually hidden `<h2>历史聊天记录</h2>` exists as a `1 x 1` clipped element, while the nav also has the direct accessible label `历史聊天记录`.

This topology is important: scrolling belongs to the history `nav` itself, not the whole sidebar shell, and the official gutter is not hidden in the observed Chrome state.

## Rows, hover/menu state, and accessibility

- A conversation is an actual link (`a[href^="/c/"]`) with its title as its accessible name, not a plain button. The sampled row was `231.64 x 40.5`, `15.75px / 22.5px`, radius `10px`, with a transparent `0.57px` bottom border and `150ms` opacity transition.
- Pin and conversation-options controls stay mounted inside each row. The options button was present in the accessibility tree before hover with label `打开“<title>”的对话选项` and `aria-expanded="false"`.
- Section triggers are buttons containing level-2 headings and expose state (`项目` and `聊天` observed as expanded). Header sibling actions have separate labels such as `整理聊天` and `新聊天`.
- The live tree exposes a skip link (`跳至内容` to `#main`), separate navigation landmarks, the hidden history heading, labelled controls, and an expanded-state signal on the sidebar toggle.
- Opening a conversation menu and its retained-on-open visual state could not be conclusively exercised before the Chrome connection timed out. The mounted control and `aria-expanded=false` default are verified; do not treat menu dimensions/animation as measured here.

## Shortcut hint

Verified without holding Ctrl: the official new-chat link exposes the rendered/a11y sequence `新聊天`, `控制` (`Ctrl`), literal `+`, `Shift`, literal `+`, `O`. Therefore the faithful static form is **Ctrl + Shift + O**, including plus separators and accessible modifier names.

The Ctrl-held alternate state was not technically observable in the available Chrome control surface before connection timeouts. No claim is made about whether holding Ctrl temporarily changes, hides, or reformats the hint.

## Concrete discrepancies in the current implementation

Compared with `src/components/chat-sidebar/chat-sidebar.tsx` and its consumer `src/components/chatgpt-sidebar-demo.tsx` in the main worktree:

1. **Collapsed/header size:** provider defaults are `railWidth="52px"` and `headerHeight="52px"`; official observed values are both `58.5px` at the measured root/font scale. Expanded width `260px` matches.
2. **Scroll element and scrollbar:** `ChatSidebarContent` is a generic `div` and explicitly hides Firefox/WebKit scrollbars. Official makes the `nav[aria-label="历史聊天记录"]` the `overflow-y:auto` element and showed a ~`15px` gutter. Move the navigation landmark to the real scrollport (or make that element the scrollport) and do not hide its scrollbar for this emulation.
3. **Landmark scope:** the demo passes `role="navigation" aria-label="历史聊天记录"` to the outer sidebar shell, so header/content/footer share one landmark. Official history navigation excludes the persistent account footer and coexists with a separate compact-rail nav.
4. **Sticky stack:** the implementation uses `sticky top-0 z-10` only on the primary section while the header is outside the scrollport. Official has both header and primary block inside the history scrollport, pinned at `top:0/z30` and `top:58.5px/z20` respectively.
5. **Conversation semantics:** demo history rows call `SidebarMenuButton`, producing buttons. Official history rows are links with real `/c/...` destinations and title accessible names, plus separately labelled pin/options buttons.
6. **Shortcut rendering/semantics:** demo hard-codes three unlabelled spans (`Ctrl`, `Shift`, `O`) with no literal plus separators. Official includes both `+` characters and accessible modifier labels. Preserve the exact string/semantics even if Ctrl-held behavior remains deferred.
7. **Transition evidence:** implementation defaults to a `250ms` width animation with a custom cubic-bezier, while the directly measured official layer transitions were `150ms linear` (panel) and `150ms steps(1)` (rail). The official width-motion curve itself was not measured, so only correct the cross-fade timing from this evidence; do not infer the width animation.

Already close/matching: `260px` expanded width; `40.5px` control/row height; `6.75px` row margins; `11.25px` horizontal padding; `10px` row radius; `15.75px / 22.5px` row typography; system font stack; black/white dark surface; footer outside the scrolling content; mounted hover actions retained by `aria-expanded`/menu-open state.

## Responsive limits and artifacts

The requested `390px` mobile state could not be verified after repeated Chrome-session timeouts. Do not use this report as evidence for drawer width, overlay opacity, mobile breakpoint, or mobile close behavior. No screenshots were saved: the geometry/DOM extraction succeeded, but the browser connection was not stable enough to capture a complete and consistently restored desktop/mobile set.
