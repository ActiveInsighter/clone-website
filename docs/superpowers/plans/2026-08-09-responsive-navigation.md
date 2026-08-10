# Responsive Navigation Refactor Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

Goal: Replace the one-off OpenAI header with a reusable, shadcn-based responsive navigation component and use it to render the OpenAI homepage clone with accurate desktop, tablet, and mobile behavior.

Architecture: Keep product-neutral navigation types and state transitions in src/components/navigation/, render the reusable shell with shadcn primitives and scoped CSS, and keep OpenAI copy, links, logo, search, login, CTA, and theme values in src/components/openai-site/. The existing homepage remains the consumer entry point.

Tech Stack: Next.js 16.3 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, shadcn/ui primitives, Lucide React, Node's built-in test runner, Chrome connector.

## Global Constraints

- Preserve all unrelated uncommitted worktree changes; never use git reset --hard, git checkout --, or broad cleanup commands.
- Follow the repository's Next.js 16 guidance in node_modules/next/dist/docs/ before editing application code.
- Use TypeScript without any, named exports, two-space indentation, and existing cn()/shadcn conventions.
- Production code for new navigation behavior must be preceded by a failing test for the pure state/helper behavior.
- Use existing dependencies; do not add a test framework or UI dependency unless a verified gap requires it.
- Keep OpenAI-specific text and business behavior out of the reusable navigation layer.
- Run the smallest relevant verification after each task and run the full project checks before completion.

---

### Task 1: Define navigation state contracts with TDD

Files:
- Create: tests/navigation-state.test.ts
- Create: src/components/navigation/navigation-types.ts
- Create: src/components/navigation/navigation-state.ts
- Modify: package.json (include tests/navigation-state.test.ts in the existing test script)

Interfaces:
- Produces NavigationState<Id>, NavigationAction<Id>, canOpenNavigationMenu(), and reduceNavigationState() for the component task.

- [ ] Step 1: Write the failing tests before production code

Create tests/navigation-state.test.ts with this behavior contract:

    import test from "node:test";
    import assert from "node:assert/strict";

    import {
      canOpenNavigationMenu,
      reduceNavigationState,
      type NavigationState,
    } from "../src/components/navigation/navigation-state.ts";

    const closed: NavigationState<string> = {
      openMenuId: null,
      mobileOpen: false,
      mobileMenuId: null,
    };

    test("opens one menu and replaces the previously open menu", () => {
      const products = reduceNavigationState(closed, { type: "open-menu", id: "products" });
      const research = reduceNavigationState(products, { type: "open-menu", id: "research" });

      assert.equal(products.openMenuId, "products");
      assert.equal(research.openMenuId, "research");
      assert.equal(research.mobileOpen, false);
    });

    test("closes the active menu and mobile surface on Escape", () => {
      const open: NavigationState<string> = {
        openMenuId: "products",
        mobileOpen: true,
        mobileMenuId: "products",
      };

      assert.deepEqual(reduceNavigationState(open, { type: "escape" }), closed);
    });

    test("does not open disabled or menu-less items", () => {
      assert.equal(canOpenNavigationMenu({ disabled: true, menu: {} }), false);
      assert.equal(canOpenNavigationMenu({ disabled: false }), false);
      assert.equal(canOpenNavigationMenu({ disabled: false, menu: {} }), true);
    });

    test("opening mobile navigation clears the desktop menu", () => {
      const open = reduceNavigationState(
        { ...closed, openMenuId: "research" },
        { type: "set-mobile-open", open: true },
      );

      assert.equal(open.openMenuId, null);
      assert.equal(open.mobileOpen, true);
    });

    test("opening a desktop menu closes mobile navigation", () => {
      const open = reduceNavigationState(
        { ...closed, mobileOpen: true, mobileMenuId: "research" },
        { type: "open-menu", id: "products" },
      );

      assert.equal(open.openMenuId, "products");
      assert.equal(open.mobileOpen, false);
      assert.equal(open.mobileMenuId, null);
    });

- [ ] Step 2: Run the new test directly and verify the expected failure

Run: node --experimental-strip-types --test tests/navigation-state.test.ts

Expected: FAIL because src/components/navigation/navigation-state.ts does not exist yet. This confirms the test exercises the new API rather than existing behavior.

- [ ] Step 3: Implement the minimal types and reducer

Create navigation-types.ts with product-neutral SiteNavigationItem, SiteNavigationColumn, SiteNavigationLink, NavigationItemState, and ResponsiveNavigationClassNames types. Create navigation-state.ts with these signatures:

    export type NavigationState<Id extends string = string> = {
      openMenuId: Id | null;
      mobileOpen: boolean;
      mobileMenuId: Id | null;
    };

    export type NavigationAction<Id extends string = string> =
      | { type: "open-menu"; id: Id | null }
      | { type: "set-mobile-open"; open: boolean }
      | { type: "set-mobile-menu"; id: Id | null }
      | { type: "escape" };

    export function canOpenNavigationMenu(item: {
      disabled?: boolean;
      menu?: object;
    }): boolean;

    export function reduceNavigationState<Id extends string>(
      state: NavigationState<Id>,
      action: NavigationAction<Id>,
    ): NavigationState<Id>;

open-menu must clear mobile state, set-mobile-open true must clear desktop state, set-mobile-open false must clear mobileMenuId, and escape must return the all-closed state.

- [ ] Step 4: Run the focused test and then the full test command

Run: node --experimental-strip-types --test tests/navigation-state.test.ts

Expected: PASS with five tests. Then update the existing package.json test script to include the new file and run npm test.

- [ ] Step 5: Review the diff and checkpoint the state layer

Run: git diff -- tests/navigation-state.test.ts src/components/navigation/navigation-types.ts src/components/navigation/navigation-state.ts package.json

Confirm that only the selected files contain this task's changes and no unrelated worktree edits were staged.

### Task 2: Implement the reusable shadcn-based navigation shell

Files:
- Create: src/components/navigation/responsive-navigation.tsx
- Create: src/components/navigation/responsive-navigation.css
- Modify: src/app/layout.tsx (import the navigation stylesheet if the Next.js guide requires global CSS imports at the app root)
- Modify: src/components/navigation/navigation-types.ts (add completed public prop and render-context types)

Interfaces:
- Consumes SiteNavigationItem, NavigationState, and reduceNavigationState() from Task 1.
- Produces the named export ResponsiveNavigation with controlled/uncontrolled menu and mobile state, action slots, render slots, breakpoint presets, and class slots.

- [ ] Step 1: Read the relevant Next.js 16 CSS and client-component guidance

Inspect the applicable files under node_modules/next/dist/docs/ for App Router client components and CSS import rules. Confirm that the navigation module can use "use client" and that its scoped stylesheet is imported from an allowed location.

- [ ] Step 2: Add the public prop and render-context types

Define ResponsiveNavigationProps<Id>, NavigationMenuRenderContext<Id>, MobileNavigationRenderContext<Id>, and the menuBehavior/breakpoint unions described in the design document. Keep ReactNode and event callback types explicit; do not use any.

- [ ] Step 3: Implement controlled/uncontrolled state wiring

Use internal state initialized from defaultOpenMenuId and defaultMobileOpen, while treating openMenuId and mobileOpen as the source of truth when provided. Dispatch all transitions through reduceNavigationState() and call the corresponding change callback exactly once per externally visible change.

- [ ] Step 4: Implement the desktop shell and shared Mega Menu

Render a semantic header and nav, the brand slot, a data-driven list, and a single panel below the bar. The default trigger must render a link when href is present, a button otherwise, and expose a separate menu affordance for menu-capable links. Add aria-expanded, aria-controls, stable IDs, focus-visible styles, pointer enter/leave handling, and Escape handling. Keep the shared panel mounted only when it has an active item and allow renderMenu to replace the default column renderer.

- [ ] Step 5: Implement the mobile Sheet branch

Use the existing shadcn Sheet primitive for the mobile surface. Pass the same data into the default mobile renderer, expose renderMobileMenu, and keep mobileContent in the mobile action area. Opening the Sheet must dispatch the state transition that closes the desktop menu.

- [ ] Step 6: Add responsive and motion styles

Scope all styles under the navigation root. Implement the sm, md, lg, xl, and 900px breakpoint presets, desktop/mobile visibility, 72px desktop and 61px mobile bar geometry, shared panel height/opacity transitions, closed-state pointer blocking, muted inactive items, focus-visible treatment, and prefers-reduced-motion overrides. Keep consumer class slots usable for further visual customization.

- [ ] Step 7: Run focused verification

Run: npm test, npm run typecheck, and npm run lint.

Expected: all tests pass and the new component compiles without warnings. Do not migrate OpenAI code until this task is green.

### Task 3: Migrate OpenAI data and actions into the reusable component

Files:
- Create: src/components/openai-site/openai-navigation-data.ts
- Create: src/components/openai-site/openai-navigation-theme.ts
- Modify: src/components/openai-site/openai-top-nav.tsx
- Modify: src/components/openai-site/openai-home-data.ts (remove duplicated navigation definitions or re-export extracted data)

Interfaces:
- Consumes ResponsiveNavigation and its public types from Task 2.
- Produces OpenAiTopNav, openAiNavigationItems, and OpenAI-specific class/theme values for the homepage consumer.

- [ ] Step 1: Extract the OpenAI navigation data without changing copy

Move the menu types and five menu groups from openai-home-data.ts into openai-navigation-data.ts. Preserve the live Chinese labels, hrefs, external flags, and column order. Re-export the data from openai-home-data.ts only if another existing module still imports it.

- [ ] Step 2: Define the OpenAI theme contract

Create openai-navigation-theme.ts with named class/theme values for the black bar, 72px desktop geometry, 61px mobile geometry, OpenAI font stack, muted controls, 45px search control, action pills, Mega Menu, and external-link treatment. Keep the generic component free of these values.

- [ ] Step 3: Replace the one-off header implementation

Rewrite openai-top-nav.tsx to compose ResponsiveNavigation. Keep the inline OpenAI wordmark in the adapter, use the extracted navigation data, and render the OpenAI search control, login dropdown, and ChatGPT CTA through action slots. Mount the search panel through overlayContent; its local state must not enter the generic navigation reducer.

- [ ] Step 4: Preserve link semantics and external labels

Use Next Link/shadcn asChild for internal links and ordinary anchors with target="_blank" plus rel="noreferrer" for external destinations. Preserve accessible labels for the wordmark, search, login, menu controls, and external-link annotation.

- [ ] Step 5: Run the homepage checks

Run: npm test, npm run typecheck, npm run lint, and npm run build.

Expected: the root homepage and existing routes build successfully, and the OpenAI page renders through the reusable navigation component.

### Task 4: Align the clone styling and research specifications

Files:
- Modify: src/app/globals.css (remove obsolete OpenAI navigation rules and retain unrelated page styles)
- Modify: src/app/layout.tsx if stylesheet or font wiring requires it
- Create: docs/research/components/responsive-navigation.spec.md
- Modify: docs/research/components/openai-top-nav.spec.md
- Modify: docs/research/BEHAVIORS.md with verified navigation behavior
- Modify: docs/research/PAGE_TOPOLOGY.md only where header layering or the mobile branch is stale

Interfaces:
- Consumes the implementation from Tasks 2 and 3.
- Produces auditable clone specifications that match the implementation and Chrome reference states.

- [ ] Step 1: Inventory and remove only obsolete navigation CSS

Use rg -n "openai-(site-header|header|mega|mobile-menu|desktop-nav|search-panel|login-menu|pill-button)" src/app/globals.css src/components/openai-site to identify old rules. Remove or replace only rules owned by the old header; preserve homepage hero, card, footer, and unrelated component styles.

- [ ] Step 2: Add the generic component specification

Document the reusable API, DOM structure, exact state attributes, interaction model, controlled/uncontrolled behavior, shadcn primitives, desktop/mobile breakpoints, and responsive test matrix in responsive-navigation.spec.md.

- [ ] Step 3: Update the OpenAI specification from the new adapter

Record the live menu labels and links, 72px desktop bar, mobile branch, menu transition, search/login/CTA slots, and all verified responsive behavior. Keep the specification factual and mark genuinely non-applicable sections as N/A rather than inventing behavior.

- [ ] Step 4: Run static checks after the styling migration

Run: npm run lint, npm run typecheck, and npm run build.

Expected: no stale class references or CSS import errors remain.

### Task 5: Run Chrome visual QA and correct discrepancies

Files:
- Modify: navigation or OpenAI adapter files only when a verified visual/interaction discrepancy is found
- Create or update: docs/design-references/openai-zh-hans-cn/ screenshots if the reference set needs refreshed captures

Interfaces:
- Consumes the complete implementation from Tasks 1–4.
- Produces a verified OpenAI clone page and a clean final check report.

- [ ] Step 1: Read Chrome local-development and screenshot guidance

Use the Chrome skill documentation for local web development and screenshots before opening the local page. Start the project with the existing npm run dev command and keep the process isolated to the workspace.

- [ ] Step 2: Compare the local page at required widths

Use Chrome at 1440px, 768px, and 390px. Compare the top bar, logo, navigation spacing, search/login/CTA controls, shared Mega Menu, mobile Sheet, page offset, and overlay layering with the live OpenAI page.

- [ ] Step 3: Verify every interaction

Check each of the five menu groups by hover and focus, switch between groups without panel flicker, close with pointer leave and Escape, open/close search, open/close login, open/close the mobile menu, and confirm internal/external links preserve their intended semantics.

- [ ] Step 4: Fix only evidence-backed discrepancies

For each mismatch, compare the computed value or behavior against the research spec, patch the smallest responsible component or theme rule, and rerun the narrowest relevant test before continuing.

- [ ] Step 5: Run final project verification

Run: npm test, npm run lint, npm run typecheck, npm run build, and npm run check.

Expected: all commands pass; the final report includes the verified widths, interaction states, any intentional approximation, and the list of files changed by this feature.
