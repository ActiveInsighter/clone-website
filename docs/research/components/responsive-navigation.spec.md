# ResponsiveNavigation Specification

## Overview

- Target file: `src/components/navigation/responsive-navigation.tsx`
- Styling: `src/components/navigation/responsive-navigation.css`
- State helper: `src/components/navigation/navigation-state.ts`
- Purpose: product-neutral, data-driven site navigation with a shared desktop menu panel and a shadcn Sheet mobile branch.

`ResponsiveNavigation` is the reusable layer. It owns layout, menu state, keyboard behavior, responsive visibility, and default rendering. It does not own search, authentication, analytics, or product-specific network behavior; those enter through slots.

## Public configuration

The common case only needs `items`, `logo`, and optional `endContent`/`mobileBarContent`/`mobileContent`:

```tsx
<ResponsiveNavigation
  items={items}
  logo={<Brand />}
  endContent={<Actions />}
  mobileBarContent={<MobileActions />}
  mobileContent={<MobileFooterActions />}
/>
```

Each item has an `id`, a React `label`, an optional `href`, `external`/`disabled` flags, and an optional `menu` made of titled columns and links. Internal links render through `next/link`; absolute HTTP(S) links render as anchors with `target="_blank"` and `rel="noreferrer"`.

Advanced consumers can replace only the part they need:

- `renderTrigger(item, state)` — custom desktop trigger while retaining `openMenu`, `closeMenu`, and `toggleMenu` callbacks.
- `renderMenu(item, context)` — custom shared Mega Menu content.
- `renderMobileMenu(context)` — flat, inline, or drill-down mobile navigation.
- `backdropContent` — optional consumer-owned backdrop content rendered below the panel.
- `overlayContent` — consumer-owned layers such as search or announcements.
- `classNames` — root, bar, bar inner, brand, desktop, navigation, list, item, trigger, menu button, panel, mobile surface, mobile toggle/trigger, desktop actions, and mobile actions.

`openMenuId`/`mobileOpen` and their callbacks are controlled-mode props. `defaultOpenMenuId`/`defaultMobileOpen` enable uncontrolled use. `menuBehavior` accepts `hover-focus`, `click`, or `hover-focus-click`; `desktopBreakpoint` accepts `sm`, `md`, `lg`, `xl`, or the target-specific `900px` preset.

## DOM and state contract

```text
header.site-navigation
├─ a.site-navigation__skip-link (optional)
├─ div.site-navigation__bar
│  └─ div.site-navigation__bar-inner
│     ├─ div.site-navigation__brand
│     ├─ div.site-navigation__desktop
│     │  ├─ nav > ul.site-navigation__list
│     │  │  └─ li[data-menu-id][data-menu-open]
│     │  │     ├─ trigger link/button
│     │  │     └─ menu button (menu-capable items only)
│     │  └─ div.site-navigation__actions
│     └─ div.site-navigation__mobile-toggle
├─ div.site-navigation__backdrop[data-state="open|closed"] (optional)
├─ div.site-navigation__panel[data-state="open|closed"]
│  └─ div.site-navigation__panel-stage
│     └─ div.site-navigation__panel-item[data-active] (one per menu item)
├─ Sheet overlay and Sheet content (mobile portal)
└─ overlayContent (consumer-owned)
```

The pure navigation state is:

```text
openMenuId: Id | null
mobileOpen: boolean
mobileMenuId: Id | null
```

The root exposes `data-breakpoint` and `data-mobile-open`; each item exposes `data-menu-id` and `data-menu-open`; the shared panel exposes `data-state`. Only one desktop menu can be open at a time. Opening mobile navigation closes the desktop menu, and opening a desktop menu closes mobile navigation. Escape closes both surfaces.

## Interaction and accessibility

- Pointer enter and keyboard focus open menu-capable items when hover/focus is enabled.
- A separate menu button exposes `aria-expanded`, `aria-controls`, and `aria-haspopup="menu"` for menu-capable links.
- The shared panel is a labelled `region` and blocks pointer interaction while closed. All menu contents stay mounted in a shared stage; the active panel is measured with `ResizeObserver` so the outer height can animate between menu sizes.
- An optional backdrop slot sits below the panel and can blur page content without applying a filter to the page itself.
- Escape returns focus to the initiating trigger or menu button when that control remains mounted.
- The mobile branch uses shadcn `Sheet` for focus trapping/restore and `ScrollArea` for long content. Default and custom mobile renderers can use a two-page drill-down track so root-to-submenu changes slide instead of replacing the DOM abruptly.
- Buttons are used for state changes; links remain real navigation links.
- Disabled items remain visible but cannot open or navigate.
- All motion is reduced to final states under `prefers-reduced-motion`.

## Visual and responsive contract

The generic layer uses neutral tokens and CSS slots. Its default geometry is a 72px desktop bar, a 61px mobile bar, a fixed shared panel below the bar, and a full-width mobile surface below the mobile bar. Breakpoint presets are:

| Preset | Mobile branch below |
| --- | ---: |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `900px` | 900px |

Consumers provide brand colors, typography, dimensions, and action styling through class slots or a theme stylesheet. The OpenAI clone uses `900px` and keeps its black theme in `openai-navigation.css`.

## Verification matrix

- Desktop 1440px: full list, shared panel, search/login/CTA slots, five menu groups, Foundation external link.
- Tablet 768px: mobile bar, search and menu controls, full-height Sheet, overlay, CTA/login mobile actions.
- Mobile 390px: 61px bar, 27px inset, scrollable Sheet, drill-down menu, focus/close behavior, no accidental horizontal page overflow.
- Keyboard: focus each menu group, open/replace groups, Escape close, focus restoration, search/login menu keyboard access.
- Link semantics: internal links preserve app navigation; every external link has a new-tab target and `noreferrer`.
