# GeminiSidebar Specification

## Overview

- **Target file:** `src/components/gemini-sidebar-clone.tsx`
- **Reusable primitive:** `src/components/sidebar/configured-sidebar.tsx`
- **Configuration:** `src/components/gemini-sidebar-data.ts`
- **Interaction model:** click-driven open/close and section disclosure; scrollable recent-chat list; responsive mobile drawer
- **Source:** `https://gemini.google.com/app?hl=zh`, inspected in the user's signed-in external Chrome tab

## DOM Structure

```text
SidebarRoot
└─ ConfiguredSidebar
   ├─ SidebarShell
   │  ├─ SidebarRail (collapsed desktop surface)
   │  │  ├─ toggle
   │  │  ├─ primary icons
   │  │  ├─ secondary icons
   │  │  └─ settings icon
   │  └─ SidebarPanel (expanded desktop/mobile surface)
   │     ├─ brand + close toggle
   │     ├─ scroll area
   │     │  ├─ primary actions
   │     │  ├─ library action
   │     │  ├─ notebooks disclosure
   │     │  └─ recents disclosure + chat list
   │     └─ account + settings footer
```

## Extracted computed styles

### Expanded sidebar

- viewport: `1441px × 770px`, device pixel ratio `1.75`
- width: `288px`
- height: `770.286px`
- position: `relative`
- display: `flex`
- background: `rgb(31, 31, 31)` (`#1f1f1f`)
- foreground: `rgb(227, 227, 227)` (`#e3e3e3`)
- font family: `Noto Sans SC`
- base font size: `18px`
- transition: `background-color 0.3s cubic-bezier(0.2, 0, 0, 1)`

### Collapsed rail

- width: `52px`
- background: `rgb(15, 15, 15)` (`#0f0f0f`)
- top toggle: `36px × 36px`, positioned at `x: 8px`, `y: 10px`
- action list: `40px` wide at `x: 6px`
- action buttons: `32px × 32px`, positioned with `4px` horizontal inset
- footer account hit area: about `40px` high
- settings button: `36px × 36px`

### Expanded menu items

- primary menu wrapper: `276px` wide, `64px` high, `x: 6px`, `y: 60px`
- item height: `32px`
- item width: `276px` for primary actions and `270px` for recent rows
- item padding: `0 8px`
- item gap: `8px`
- item border radius: `9999px`
- item font size: `18px` in the live page, reduced to `15px` in the local clone so Chinese labels match the visual density of the captured screenshot
- section labels: `14px`, muted white at approximately `rgba(255, 255, 255, 0.55)`

### Header and footer

- close button: `40px × 40px`, at `x: 234px`, `y: 8px`
- settings button: `36px × 36px`, at approximately `x: 244px`, `y: 720px`
- footer account: flex row, `40px` high in the original
- account text: `Tom Li`

## States & Behaviors

### Open / close

- **Trigger:** click `打开边栏` / `关闭边栏`, or the reusable sidebar keyboard shortcut (`Ctrl/Cmd + B`)
- **Expanded:** panel width `288px`, panel visible, rail hidden from pointer interaction
- **Collapsed:** shell width `52px`, rail visible, panel opacity `0` and `pointer-events: none`
- **Transition:** `300ms cubic-bezier(0.2, 0, 0, 1)` for width/background; `150ms linear` for surface opacity

### Section disclosure

- **Trigger:** click `展开/收起“笔记本”` or `展开/收起“最近”`
- **Default:** both sections expanded on the captured signed-in state
- **Collapsed section:** content height reduces to zero and chevron rotates to the right
- **Implementation:** reusable `SidebarSection` backed by the existing collapsible primitive

### Active and hover states

- active/hover row uses a dark translucent pill (`rgba(255, 255, 255, 0.08)` in the local clone)
- controls use transparent background by default
- icon controls receive the same row highlight on hover/focus
- visible keyboard focus is represented by the shared sidebar focus ring token

### Recent list

- **Interaction:** vertical scrolling inside the sidebar content area
- **Content:** real visible Chinese and English conversation titles extracted from the signed-in page; local hrefs are intentionally static clone routes
- **Behavior:** long labels ellipsize in the reusable row component

## Verbatim content captured

- `Gemini`
- `打开边栏`
- `关闭边栏`
- `升级`
- `临时对话`
- `发起新对话`
- `搜索对话内容`
- `库`
- `笔记本`
- `新建笔记本`
- `最近`
- `虚拟国外号码租用网站`
- `Greeting and Offer of Assistance`
- `ChatGPT Prompt Queue UI Style`
- `AI 助手能力介绍与应用`
- `二叉树递归遍历原理详解`
- `合同变换：二次型与相似变换`
- `二次型：定义、化简与应用`
- `PDF 优化：书签兼容与封面重构`
- `代码高亮配色优化建议`
- `SVG 侧边栏动画图标设计`
- `ArkUI 侧边栏按钮固定`
- `AI 输出解析与显示代码`
- `ArkWeb 本地缓存使用指南`
- `流式 Markdown 渲染方案`
- `设置`
- `Tom Li`

## Responsive behavior

- **Desktop (1440px):** expanded width `288px` or collapsed rail width `52px`; recent list occupies the middle scroll region; footer remains pinned
- **Tablet (768px):** preserve the same visual hierarchy; mobile media query begins at `768px` in the local implementation
- **Mobile (390px):** the desktop shell is replaced by the shared mobile dialog drawer; the main surface exposes the same open trigger, while the sidebar panel remains `288px` wide up to viewport constraints

## Assets

- No external raster assets are required for the sidebar clone.
- Icons are local React SVG components in `src/components/icons.tsx`.
- The brand mark is intentionally a lightweight text glyph because the visible Gemini logo was rendered as an inline icon font/SVG sprite in the source page.
