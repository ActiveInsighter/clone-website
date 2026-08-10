# Single-Server Multi-Site Clone Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make one Next.js development server expose a manifest-driven clone selector and explicit `/clones/<siteId>` routes without retaining legacy root-level clone routing.

**Architecture:** Keep the pure site manifest as the source of truth, add a manifest-driven selector, and lazy-load the selected site inside the optional catch-all clone route. Use a site-segment layout for metadata and a route error boundary, while the root route redirects to the selector. Delete legacy catch-all and demo routes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Node built-in test runner, existing site entry components.

## Global Constraints

- Use one `npm run dev` process and one port for all clone routes.
- Preserve clone behavior under `/clones/openai`, `/clones/chatgpt`, and `/clones/studio`.
- Do not preserve `/` as OpenAI, old root-level deep links, or `/sidebar-demo`.
- Unknown site IDs must render `notFound()` and not fall back to another clone.
- Keep site-specific components behind `src/sites/<siteId>/entry.tsx` and load only the requested entry at runtime.
- Keep the root layout neutral; site routes own metadata and local theme state.
- Follow the TDD cycle: write a failing test, run it, implement the smallest change, run it again.

---

### Task 1: Add the manifest-driven selector contract

**Files:**
- Create: `tests/clone-picker.test.ts`
- Modify: `src/sites/manifest.ts`
- Modify: `src/sites/index.ts`

**Interfaces:**
- Produces `getClonePickerItems(): readonly ClonePickerItem[]`.
- `ClonePickerItem` contains `id: SiteId`, `label: string`, and `href: string`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict"
import test from "node:test"

import { getClonePickerItems } from "../src/sites/manifest.ts"

test("builds one explicit selector link for every registered clone", () => {
  assert.deepEqual(
    getClonePickerItems().map(({ id, label, href }) => ({ id, label, href })),
    [
      { id: "openai", label: "OpenAI", href: "/clones/openai" },
      { id: "chatgpt", label: "ChatGPT", href: "/clones/chatgpt" },
      { id: "studio", label: "Studio", href: "/clones/studio" },
    ],
  )
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --experimental-strip-types --test tests/clone-picker.test.ts`

Expected: FAIL because `getClonePickerItems` is not exported.

- [ ] **Step 3: Implement the minimal manifest helper**

Map `Object.values(siteManifests)` to immutable `{ id, label, href: defaultPath }` objects and export the helper from `src/sites/index.ts`.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --experimental-strip-types --test tests/clone-picker.test.ts`

Expected: PASS.

### Task 2: Implement the selector and root entry route

**Files:**
- Create: `src/components/clone-picker.tsx`
- Create: `src/app/clones/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `package.json`

**Interfaces:**
- `ClonePicker` consumes `getClonePickerItems()` and renders Next `Link` elements.
- `/` redirects to `/clones`.

- [ ] **Step 1: Write the failing route contract assertion**

Extend `tests/clone-picker.test.ts` with the requirement that all picker hrefs start with `/clones/` and are unique.

- [ ] **Step 2: Run the focused test and verify it fails if the helper violates the route contract**

Run: `node --experimental-strip-types --test tests/clone-picker.test.ts`

Expected: PASS for the helper contract after Task 1; this step locks the route shape before JSX is added.

- [ ] **Step 3: Implement the selector page**

Create a server-rendered selector with one keyboard-accessible `Link` card per manifest item. Keep the presentation neutral and independent of any clone's visual CSS. Make `src/app/page.tsx` call `redirect("/clones")`.

- [ ] **Step 4: Remove the obsolete test script entry**

Remove `tests/site-route-selection.test.ts` from the `npm test` command because the legacy route selector is being deleted; add `tests/clone-picker.test.ts` instead.

- [ ] **Step 5: Run typecheck and focused tests**

Run: `node --experimental-strip-types --test tests/clone-picker.test.ts`

Run: `npm run typecheck`

Expected: both pass.

### Task 3: Make clone routing explicit and lazy

**Files:**
- Create: `src/sites/loaders.ts`
- Create: `src/app/clones/[siteId]/layout.tsx`
- Create: `src/app/clones/[siteId]/error.tsx`
- Modify: `src/app/clones/[siteId]/[[...path]]/page.tsx`
- Modify: `src/app/layout.tsx`
- Delete: `src/sites/components.tsx`

**Interfaces:**
- `siteLoaders: Record<SiteId, SiteLoader>` returns a module whose default export is a no-props React component.
- The dynamic route exports `dynamicParams = false` and `generateStaticParams()` for the three manifest IDs.
- The site layout generates metadata from `getSiteManifest(siteId)`.

- [ ] **Step 1: Write the failing loader contract test**

Add to `tests/site-manifest.test.ts` a pure assertion that every manifest ID has a stable `/clones/<id>` default path and no two IDs share one.

- [ ] **Step 2: Run the focused manifest tests**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: PASS against the existing manifest; this establishes the route contract before replacing static component imports.

- [ ] **Step 3: Implement lazy site loaders**

Create one dynamic import per entry module in `src/sites/loaders.ts`. Each entry must expose a no-props default component so the route can render the selected site without a central eager component map.

- [ ] **Step 4: Implement the site layout and error boundary**

Use `generateMetadata` for the selected site's title and description. Return a `data-clone-site` wrapper. Add a client `error.tsx` with a retry button and a link back to `/clones`.

- [ ] **Step 5: Update the dynamic page**

Resolve the manifest, call `notFound()` for an unknown ID, load the selected component, and render it. Keep optional nested paths so Studio can continue to inspect its route pathname under `/clones/studio/...`.

- [ ] **Step 6: Neutralize the root layout**

Remove OpenAI-specific metadata and root-level navigation CSS imports. Keep only the shared global stylesheet and font setup.

- [ ] **Step 7: Run typecheck**

Run: `npm run typecheck`

Expected: PASS.

### Task 4: Remove legacy routes and localize theme mutations

**Files:**
- Delete: `src/app/[...slug]/page.tsx`
- Delete: `src/app/sidebar-demo/page.tsx`
- Delete: `src/sites/legacy-route-selection.ts`
- Delete: `tests/site-route-selection.test.ts`
- Modify: `src/components/chatgpt-home.tsx`
- Modify: `src/components/studio-demo.tsx`
- Modify: `package.json`

**Interfaces:**
- No route outside `/clones/<siteId>` renders a clone.
- ChatGPT and Studio theme state is represented by local `.dark` wrappers, not `document.documentElement` mutations.

- [ ] **Step 1: Write the failing static boundary check**

Add a pure test to `tests/clone-picker.test.ts` asserting that picker links are the only supported clone entry paths. The deleted route files are verified by the build route manifest in Task 5.

- [ ] **Step 2: Run the existing suite before deletion**

Run: `npm test`

Expected: PASS before removing the legacy test and route.

- [ ] **Step 3: Delete legacy route code and test registration**

Remove the old catch-all page, sidebar demo page, legacy pathname selector, and its test file. Remove that test path from `package.json`.

- [ ] **Step 4: Localize ChatGPT theme state**

Wrap the ChatGPT surface in a local class based on `initialDark` and remove its `document.documentElement.classList.toggle` and `colorScheme` effect.

- [ ] **Step 5: Localize Studio theme state**

Wrap the Studio `AppShell` in a local `dark` class based on component state and remove its document-level theme effect.

- [ ] **Step 6: Run tests and typecheck**

Run: `npm test`

Run: `npm run typecheck`

Expected: all tests and typecheck pass.

### Task 5: Verify the single-server route contract

**Files:**
- Modify: `README.zh-CN.md`
- Modify: `README.md`

- [ ] **Step 1: Document the development URLs**

Document one `npm run dev` command and the four supported URLs: `/clones`, `/clones/openai`, `/clones/chatgpt`, `/clones/studio`.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint`

Run: `npm run typecheck`

Expected: both pass.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: the build succeeds and includes the selector and three clone route entries.

- [ ] **Step 5: Inspect the route tree and working tree**

Confirm no root catch-all or sidebar demo route remains, and report any untracked logs/temp directories left outside the commit.

