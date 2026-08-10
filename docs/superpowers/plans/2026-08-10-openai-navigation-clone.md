# OpenAI Navigation Clone Implementation Plan

> For agentic workers: use a task-by-task execution workflow. Steps use checkbox syntax for tracking.

Goal: Rebuild the OpenAI Chinese homepage header and first viewport around a reusable three-mode responsive navigation contract that matches the live site at desktop, medium, and mobile widths.

Architecture: Keep ResponsiveNavigation as the generic owner of navigation state, menu panel rendering, mobile Sheet, Escape, and focus restoration. Add explicit compact-width content and Escape hooks, then let OpenAiTopNav supply site-specific actions and search UI. Keep the homepage data-driven and correct its hero/card geometry in the OpenAI theme stylesheet.

Tech Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 base styles, colocated CSS, Node built-in test runner, Lucide icons, existing local OpenAI image assets.

## Global Constraints

- Preserve unrelated existing working-tree changes.
- Keep ResponsiveNavigation backwards compatible for existing callers.
- Use TypeScript strict mode and named exports.
- Use live facts recorded in docs/research/openai-zh-hans-cn and this plan; do not replace real assets with placeholders.
- Verify every production change with a focused failing test first where a pure contract can express it.
- Final verification must include npm run test, npm run lint, npm run typecheck, and npm run build.

---

### Task 1: Record live OpenAI behavior and define the navigation mode contract

Files:

- Create docs/research/openai-zh-hans-cn/2026-08-10-responsive-navigation.md
- Modify docs/research/BEHAVIORS.md
- Modify docs/research/PAGE_TOPOLOGY.md
- Modify docs/research/components/openai-top-nav.spec.md
- Modify docs/research/components/openai-home.spec.md

Produces: the exact responsive facts used by later tasks: complete navigation at 1200px and above, compact action bar at 900–1199px, mobile action bar below 900px; desktop bar 72px, compact/mobile bar 61px, desktop inset 36px, compact/mobile inset 27px.

- [ ] Write the research artifact with the 1440×900, 1024×900, 768×900 and 390×844 states, plus search-open, login-open, mobile menu-open, prompt rotation, hover menu heights, and known routing limitations.
- [ ] Self-review the artifacts. No Supabase Studio language may remain in the OpenAI behavior and topology files; every component spec must name an interaction model.

### Task 2: Add a failing, pure viewport-mode test

Files:

- Create src/components/navigation/navigation-mode.ts
- Create tests/navigation-mode.test.ts

Produces: NavigationViewportMode equal to desktop, compact or mobile, and getNavigationViewportMode(width, desktopBreakpoint = 1200, compactBreakpoint = 900).

- [ ] Write a test that asserts 1440 and 1200 are desktop, 1199 and 900 are compact, and 899 and 390 are mobile.
- [ ] Run node --experimental-strip-types --test tests/navigation-mode.test.ts and confirm the expected module-not-found failure.
- [ ] Implement the minimal pure function with the three exact boundary rules.
- [ ] Run the focused test again and confirm one passing test.

### Task 3: Extend the generic navigation with compact slots and Escape ownership

Files:

- Modify src/components/navigation/navigation-types.ts
- Modify src/components/navigation/responsive-navigation.tsx
- Modify src/components/navigation/responsive-navigation.css
- Modify src/components/navigation/navigation-state.ts
- Modify tests/navigation-state.test.ts

Produces: ResponsiveNavigationProps with compactContent, compactBreakpoint, and onEscape while retaining endContent, mobileBarContent, mobileContent, renderMenu, renderMobileMenu, and menuBehavior.

- [ ] Add/retain reducer tests for open-menu closing mobile state and set-mobile-open clearing desktop state.
- [ ] Run the focused reducer tests before the shared component change to establish the baseline.
- [ ] Render a compact sibling slot containing compactContent and the same menu trigger, visible only from compactBreakpoint through desktopBreakpoint.
- [ ] Call onEscape alongside the existing escape reducer and focus restoration.
- [ ] Replace overlapping media queries with three explicit modes. Desktop is 72px high; compact/mobile are 61px high; hidden controls use display:none.
- [ ] Run npm test and npm run typecheck.

### Task 4: Rebuild OpenAI navigation adapter and search/mobile states

Files:

- Modify src/components/openai-site/openai-top-nav.tsx
- Modify src/components/openai-site/openai-navigation-theme.ts
- Modify src/components/openai-site/openai-navigation.css
- Modify src/components/openai-site/openai-navigation-data.ts
- Create tests/openai-navigation-contract.test.ts

Produces: a reusable action composition where desktop gets full nav plus actions, medium gets actions plus menu, and mobile gets search plus menu; the login menu contains ChatGPT, API 平台 and Codex.

- [ ] Write and run a failing contract test for the third login entry and the 1200px/900px theme breakpoints.
- [ ] Build one search control, one login menu and one CTA, and pass them through the desktop, compact and mobile slots without duplicating state.
- [ ] Implement the search panel with the live visual structure: large “咨询 OpenAI 研究相关问题” input, rule, right-side circular arrow, opacity/translate transition, no backend.
- [ ] Wire onEscape and menu callbacks so search and menus are mutually exclusive.
- [ ] Use an OpenAI-specific mobile renderer with a top “← 首页” return affordance, large first-level links, nested menu state, and CTA/login actions without a redundant bottom close row.
- [ ] Run the contract test, npm test and npm run typecheck.

### Task 5: Correct the OpenAI hero, prompt motion, and featured grid

Files:

- Modify src/components/openai-site/openai-home.tsx
- Modify src/app/globals.css
- Modify src/components/openai-site/openai-home-data.ts
- Modify docs/research/components/openai-home.spec.md

Produces: a stable-height animated prompt and three-width hero/card layout using the existing local assets.

- [ ] Add and run a failing contract test for a non-empty prompt list and large/medium first two featured cards.
- [ ] Export the smallest read-only content contract needed by the test.
- [ ] Render prompt text in a fixed-height aria-live region keyed by promptIndex and animate fade/translate; keep 3600ms rotation and reduce motion support.
- [ ] Use composer width min(768px, calc(100vw - 54px)), height 117px, radius 16px, desktop inset 36px and compact/mobile inset 27px.
- [ ] Use a 3.17fr 1fr featured desktop grid, stack at compact/mobile widths, wrap pills into two rows at 390px, and preserve real images.
- [ ] Run npm test and npm run typecheck.

### Task 6: Browser visual QA at four widths and final verification

Files:

- Modify only files required by the visual diff.
- Update docs/research/openai-zh-hans-cn/2026-08-10-responsive-navigation.md with final observations.

- [ ] Run npm run dev and open the local root page.
- [ ] Compare 1440×900, 1024×900, 768×900 and 390×844. Verify header items, hero title/composer/pills, featured card start, scrollbar-safe right edge and no horizontal overflow.
- [ ] Hover each desktop menu, open and close search, open login and verify three items, open mobile menu, enter/leave a submenu, press Escape for each overlay, and confirm reduced-motion visibility.
- [ ] Run npm run check and read the complete output before claiming completion.
