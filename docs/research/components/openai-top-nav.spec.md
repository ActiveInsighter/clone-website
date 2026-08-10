# OpenAiTopNav Specification

## Overview

- Target: src/components/openai-site/openai-top-nav.tsx
- Interaction model: hover/focus desktop menus, click-driven search/login/mobile menu, Escape close.
- Shared primitive: src/components/navigation/responsive-navigation.tsx

## Responsive contract

- Desktop at 1200px and above: header 72px; padding-inline 36px; full primary nav; search after the nav; login and CTA at the far right.
- Compact at 900–1199px: header 61px; padding-inline 27px; primary nav and Mega Menu hidden; search, login, CTA, menu visible.
- Mobile below 900px: header 61px; padding-inline 27px; search and menu visible; login and CTA render inside the Sheet.

## DOM structure

ResponsiveNavigation contains the fixed bar, a desktop slot, a compact slot, a mobile bar slot, one shared panel, the search overlay and the mobile Sheet. OpenAiTopNav supplies Logo, OpenAi navigation items, the action slots and the custom mobile renderer.

## Exact visual values

- Logo SVG: approximately 62.77px wide and 17px high.
- Search and menu hit areas: 45px square.
- Login and CTA: 40.5px high, 45px radius, 15.75px text.
- Desktop nav text: 19.125px with -0.19125px letter spacing.
- Desktop primary item widths: 65.25px for short items, 94.5px for 开发人员, 79.875px for 基金会.
- Desktop Mega Menu transition: about 200ms cubic-bezier(0.4, 0, 0.2, 1).
- Search panel content: centered max-width about 1272px, large input, bottom rule, 51px arrow button.

## States

- Search open: Search icon crossfades to X in the same 45px hit area; the always-mounted panel reveals from top to bottom with clip-path/opacity motion under the active bar.
- Login open: same-layer popover shows ChatGPT, API 平台, Codex at z-index 120, above the header and Mega Menu.
- Desktop menu open: one shared panel; inactive items are 60% white, while a fixed backdrop applies `backdrop-filter: blur(12px)` to page content.
- Mobile root: large first-level links in the first page of a persistent drill-down track.
- Mobile submenu: left-arrow 首页 return row, muted group title, large child links and no redundant close row; the second page slides in horizontally.

## Assets and content

- Logo is inline SVG.
- Icons are Lucide Search, X, ChevronDown, ArrowUp, ArrowUpRight and ArrowLeft.
- Navigation content comes from openai-navigation-data.ts.
