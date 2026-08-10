# OpenAI 中文首页页面拓扑

Browser viewport
└─ OpenAiHome
   ├─ Fixed OpenAiTopNav
   │  ├─ Logo
   │  ├─ Desktop primary navigation
   │  ├─ Desktop Mega Menu + page backdrop blur
   │  ├─ Search / login / CTA action group
   │  ├─ Compact action bar
   │  ├─ Mobile action bar
   │  ├─ Search panel
   │  └─ Mobile Sheet
   ├─ Hero
   │  ├─ Centered heading
   │  ├─ Fixed-height prompt composer
   │  └─ Pill links
   ├─ Featured content grid
   ├─ Latest updates section
   ├─ Customer stories section
   ├─ Latest research section
   ├─ Enterprise solutions section
   ├─ Start using ChatGPT CTA
   └─ Footer

## Layout and stacking

- The page background is black and clips horizontal overflow.
- The header bar is fixed at z-index 100.
- The page backdrop sits below the menu at z-index 70 and blurs page content only when a Mega Menu is open.
- Desktop Mega Menu sits below the 72px header at z-index 80 and animates its measured height.
- Search panel sits below the active header at z-index 95 and remains mounted for enter/exit animation.
- Login popover uses z-index 120 so it stays above the navigation surface.
- Mobile Sheet begins below the 61px header at z-index 110 and covers the page content.
- Main content owns normal document flow; no second application scroll container is required.

## Interaction model

- Header primary items: hover/focus-driven on desktop, hidden in compact/mobile.
- Search: click-driven open/close, Escape-driven close.
- Login: click-driven dropdown.
- Mobile navigation: click-driven Sheet, click-driven submenu, Escape-driven close.
- Prompt: time-driven rotation with CSS transition.
- Cards and links: static navigation with hover styles.
- Footer controls: visual placeholders without backend behavior.
