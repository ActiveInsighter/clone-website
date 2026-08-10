# ChatGptHome Specification

## Overview

- **Target file:** `src/components/chatgpt-home.tsx`
- **Screenshots:** `docs/design-references/chatgpt/qa-desktop.png`, `docs/design-references/chatgpt/qa-mobile.png`
- **Interaction model:** click-driven controls with keyboard-driven composer submission

## DOM structure

- `SidebarRoot`
  - `ChatGptSidebarDemo`
  - 59px header with ChatGPT Plus, search, and collapse/close control
  - sticky quick-entry rows and section headings
  - projects and recent chat lists
  - account footer with avatar, plan, and download action
  - `ChatSidebarInset`
    - 52px conversation header
    - centered empty-state heading
    - rounded composer form
    - disclaimer and live status line

## Computed implementation values

### Shell and sidebar

- Shell: `h-svh w-full flex`.
- Expanded sidebar width: `260px`.
- Collapsed rail width: `59px`.
- Header height: `59px`.
- Sidebar background: `#fcfcfc` in light mode and `#000000` in dark mode.
- Sidebar menu row: `41px` high, `10px` radius, `6.75px` horizontal margin, `10px` radius.

### Main surface

- Main surface: white in light mode and black in dark mode.
- Header horizontal padding: `12px`.
- Empty-state heading: `32px` on desktop, `30px` on small screens, medium weight.
- Heading-to-composer gap: `32px`.
- Composer max width: `865px` on the measured 1441px viewport.
- Composer height: `54px`, radius `28px`, dark surface `#2f2f2f`.

## States and behaviors

### Sidebar collapse

- **Trigger:** header button, rail button, or `Ctrl/Cmd+B`.
- **Expanded:** width `260px`, panel opacity `1`, rail opacity `0`.
- **Collapsed:** width `59px`, panel opacity `0`, rail opacity `1`; logo slot swaps to the expand icon on hover without moving any rail item.
- **Transition:** `250ms cubic-bezier(0.32, 0.72, 0, 1)` for width and `150ms linear` for opacity.

### Composer

- **Empty:** send button disabled at 30% opacity.
- **Has text:** send button enabled and keyboard Enter submits.
- **Submitted:** clears the field and announces a local demo status.
- **Voice:** microphone button toggles a local recording state.

## Text content

- `ChatGPT Plus`
- `新聊天`
- `文件库`
- `已安排`
- `插件`
- `更多`
- `已置顶`
- `项目`
- `聊天`
- `你今天在想些什么？`
- `问问 ChatGPT`
- `ChatGPT 可能会犯错。请核查重要信息。了解详情`

## Responsive behavior

- **1440px:** expanded sidebar and centered composer.
- **768px:** desktop sidebar remains available with responsive main gutters.
- **390px:** sidebar becomes a modal sheet; hamburger opens it, close icon dismisses it, the project chip is hidden, and sign-up is hidden.
