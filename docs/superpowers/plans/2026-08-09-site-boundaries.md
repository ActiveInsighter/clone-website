# Site Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit per-site ownership and a clone registry while preserving the existing pages and navigation behavior.

**Architecture:** A pure `src/sites/manifest.ts` describes supported clone IDs and their navigation surface. A pure `src/sites/registry.ts` exposes tested metadata lookup, while `src/sites/components.tsx` binds those manifests to the existing React entry components. A new optional catch-all route under `/clones/[siteId]` renders only registered sites; legacy routes remain untouched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Node built-in test runner, existing shadcn and sidebar primitives.

## Global Constraints

- Preserve existing visual output, interactions, and existing URL behavior.
- Keep marketing navigation, ChatGPT compound sidebar, and Studio shadcn sidebar as separate contracts.
- Do not move or rewrite existing navigation implementation files in this phase.
- New pure modules must remain importable by the existing Node test runner.

### Task 1: Define and test site ownership metadata

**Files:**
- Create: `src/sites/manifest.ts`
- Create: `tests/site-manifest.test.ts`

**Interfaces:**
- `SiteId = "openai" | "chatgpt" | "studio"`
- `NavigationSurface = "marketing-top-nav" | "chatgpt-compound-sidebar" | "studio-app-shell"`
- `getSiteManifest(siteId: string): SiteManifest | undefined`

- [ ] **Step 1: Write the failing tests**

```ts
import test from "node:test"
import assert from "node:assert/strict"
import { getSiteManifest, siteManifests } from "../src/sites/manifest.ts"

test("lists exactly the supported clone sites", () => {
  assert.deepEqual(Object.keys(siteManifests), ["openai", "chatgpt", "studio"])
})

test("keeps each clone attached to its correct navigation surface", () => {
  assert.equal(siteManifests.openai.navigation.surface, "marketing-top-nav")
  assert.equal(siteManifests.chatgpt.navigation.surface, "chatgpt-compound-sidebar")
  assert.equal(siteManifests.studio.navigation.surface, "studio-app-shell")
})

test("returns no manifest for an unknown site id", () => {
  assert.equal(getSiteManifest("unknown"), undefined)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: FAIL because `src/sites/manifest.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure manifest**

Define the three literal site IDs, labels, navigation surface metadata, and `getSiteManifest` lookup without importing any `.tsx` component.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: 3 passing tests.

### Task 2: Add site entrypoints and registry

**Files:**
- Create: `src/sites/openai/entry.tsx`
- Create: `src/sites/chatgpt/entry.tsx`
- Create: `src/sites/studio/entry.tsx`
- Create: `src/sites/registry.ts`
- Create: `src/sites/components.tsx`
- Create: `src/sites/index.ts`

**Interfaces:**
- `getCloneSite(siteId: string): SiteManifest | undefined`
- `siteComponents` maps every `SiteId` to its existing site root component.

- [ ] **Step 1: Extend the manifest test with entry ownership assertions**

Add a test that imports `getCloneSite` and asserts the registry resolves `openai`, `chatgpt`, and `studio`, while preserving each manifest's navigation surface.

- [ ] **Step 2: Run the focused test and verify the new registry assertion fails**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: FAIL because the registry module does not exist.

- [ ] **Step 3: Add compatibility entry modules**

Each entry module re-exports the current implementation without editing its navigation internals:

```ts
export { OpenAiHome as default, OpenAiHome } from "@/components/openai-site/openai-home"
```

Use the analogous existing exports for ChatGPT and Studio.

- [ ] **Step 4: Add the pure registry, component map, and public site exports**

Keep `getCloneSite` in the pure registry and import the three `.tsx` entry modules only from `components.tsx`. This keeps the registry testable by Node's built-in test runner while the Next route uses both modules.

- [ ] **Step 5: Run typecheck and the focused test**

Run: `npm run typecheck`

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: typecheck succeeds and all focused tests pass.

### Task 3: Add explicit clone routes without breaking legacy routes

**Files:**
- Create: `src/app/clones/[siteId]/[[...path]]/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/sidebar-demo/page.tsx`
- Modify: `src/app/[...slug]/page.tsx`

**Interfaces:**
- `/clones/openai` renders the existing OpenAI root.
- `/clones/chatgpt` renders the existing ChatGPT root.
- `/clones/studio` and any nested path render the existing Studio root.
- Existing `/`, `/sidebar-demo`, and legacy catch-all output remain unchanged.

- [ ] **Step 1: Add route-level tests to the manifest test**

Assert that every manifest has a stable `defaultPath` and that the three site IDs are the only accepted clone route IDs. Keep the test pure; route rendering remains covered by Next typecheck/build.

- [ ] **Step 2: Run the focused test and verify the new route contract fails**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

Expected: FAIL until `defaultPath` metadata is present.

- [ ] **Step 3: Implement the dynamic clone page**

Await Next 16 `params`, resolve the registry, call `notFound()` for unknown site IDs, and render the registered component. Add `generateStaticParams` for the three default site pages. Keep metadata unchanged in this compatibility phase.

- [ ] **Step 4: Switch only top-level page imports to site entrypoints**

Use the new site entry modules in the existing root, sidebar-demo, and legacy catch-all pages. Do not change JSX structure, props, class names, or navigation imports.

- [ ] **Step 5: Run typecheck and build**

Run: `npm run typecheck`

Run: `npm run build`

Expected: both commands succeed and the new clone routes are included in the App Router build.

### Task 4: Full regression verification

**Files:**
- No production files unless a verification failure identifies a regression.

- [ ] **Step 1: Run focused site manifest tests**

Run: `node --experimental-strip-types --test tests/site-manifest.test.ts`

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint`

Run: `npm run typecheck`

- [ ] **Step 4: Run the production build**

Run: `npm run build`

- [ ] **Step 5: Inspect the diff for navigation boundary violations**

Confirm the diff does not replace `ResponsiveNavigation` with either sidebar implementation, does not replace `src/components/ui/sidebar.tsx` in Studio, and does not modify existing navigation CSS behavior.
