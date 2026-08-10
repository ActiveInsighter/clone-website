# OpenAI 中文官网三档响应式取证

## 取证范围

- URL: https://openai.com/zh-Hans-CN/
- Browser viewports: 1440×900、1024×900、768×900、390×844
- 取证日期: 2026-08-10
- 页面背景: #000；前景: #fff；弱化前景: rgba(255, 255, 255, 0.6)

## Header contract

| CSS viewport | Header content | Bar height | Horizontal inset |
| --- | --- | ---: | ---: |
| 1440 | Logo、研究、产品、企业、开发人员、公司、基金会、搜索、登录、试用 ChatGPT | 72px | 36px |
| 1024 | Logo、搜索、登录、试用 ChatGPT、菜单 | 61px | 27px |
| 768 | Logo、搜索、菜单 | 61px | 27px |
| 390 | Logo、搜索、菜单 | 61px | 27px |

The breakpoint model is complete desktop at 1200px and above, compact action bar from 900px through 1199px, and mobile action bar below 900px. At 1440px the logo measures approximately 62.77×17px. Search and menu controls use a 45px hit area. Login and CTA controls are 40.5px high with 45px radius.

Desktop order is Logo → primary navigation → Search → Login/CTA. The desktop action group is aligned to the right edge; it is not allowed to push Search next to the CTA. Compact order is Logo → Search → Login → CTA → Menu. Mobile order is Logo → Search → Menu.

## Hero contract

The page starts under a fixed header. The prompt headline is centered, followed by a 768px maximum composer. The composer is 117px high, has a 16px radius, dark gray surface, 18px internal padding, and a 40–41px circular submit control at the lower right.

- Desktop: featured media begins around y=674px.
- Compact 1024px: featured media begins around y=706px.
- Mobile 390px: featured media begins around y=650px.
- Mobile prompt pills wrap into two centered rows rather than becoming a horizontally clipped carousel.

The prompt placeholder is time-driven and changes every few seconds. The composer geometry remains stable while the text transitions.

## Interaction states

### Desktop navigation

The five menu-bearing items open one shared fixed panel on hover or focus. Moving to another item replaces the active panel. Observed panel heights are approximately 208px for Products, 321px for Research, 378px for Developers and Company, and 434px for Business. Transition is height/opacity based and about 200ms with an ease-in-out cubic-bezier.

When one menu is open, inactive primary labels fade to 60% white. Escape closes the panel and restores focus to its trigger.

### Search

Search replaces the search icon with an X in the same 45px hit area. The panel begins below the active header and uses a large single-line prompt reading “咨询 OpenAI 研究相关问题”, a bottom rule, and a circular arrow submit control on the right. It has no backend behavior in this clone. Escape closes it.

### Login

The login trigger is a rounded dark button with a down chevron. Its menu contains ChatGPT, API 平台 and Codex. The menu surface is dark with rounded corners and eight-pixel internal padding.

### Mobile menu

The mobile menu is a black full-width surface below the 61px header. Root state shows large first-level links. Submenu state shows an arrow-left “首页” return row, a muted section label and large child links. The mobile action area has a top rule and shows the white CTA above the dark login control. There is no redundant bottom “关闭” row; the header menu trigger remains the close affordance.

## Implementation mapping

- Generic behavior and state: src/components/navigation/responsive-navigation.tsx
- Generic mode contract: src/components/navigation/navigation-mode.ts
- OpenAI adapter: src/components/openai-site/openai-top-nav.tsx
- OpenAI theme: src/components/openai-site/openai-navigation-theme.ts
- OpenAI visual rules: src/components/openai-site/openai-navigation.css
- Hero/card visual rules: src/app/globals.css

## Implementation QA

- Search opens from the shared control, swaps to an X, autofocuses the large prompt, and closes on Escape.
- Login exposes the three expected menu items through an accessible menu surface.
- The shared navigation reducer keeps desktop menus, mobile sheets, and Escape focus restoration mutually consistent.
- Prompt rotation is height-stable and does not move the composer or pill row.
- `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass on 2026-08-10.
