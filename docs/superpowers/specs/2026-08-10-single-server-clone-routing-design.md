# Single-Server Multi-Site Clone Routing Design

## Goal

Run all website replicas from one Next.js development server and one port, with a selector page and explicit site-owned URL prefixes:

- `/clones` — clone selector
- `/clones/openai` — OpenAI replica
- `/clones/chatgpt` — ChatGPT replica
- `/clones/studio` — Studio replica

The previous root OpenAI page, legacy catch-all routing, and sidebar demo route are intentionally removed. Existing clone-specific behavior is preserved under the new site prefixes; old root-level compatibility is out of scope.

## Architecture

The App Router owns only route composition. `src/sites/manifest.ts` remains the pure catalog of supported clones, while `src/sites/loaders.ts` maps each `SiteId` to a lazy entry loader. The dynamic clone route resolves only the requested site and uses `dynamicParams = false` so unknown site IDs become 404s.

`/` redirects to `/clones`, and `/clones` renders a selector from the manifest. A site-segment layout provides site-specific metadata and a route-local `error.tsx` contains rendering failures below that segment. Root layout metadata and styles become neutral; site components own their local theme state instead of mutating the document root.

## Route ownership

```text
src/app/page.tsx                                  -> redirect("/clones")
src/app/clones/page.tsx                           -> selector
src/app/clones/[siteId]/layout.tsx                -> metadata + site frame
src/app/clones/[siteId]/error.tsx                 -> site route error boundary
src/app/clones/[siteId]/[[...path]]/page.tsx      -> registered clone loader
```

The old `src/app/[...slug]/page.tsx`, `src/app/sidebar-demo/page.tsx`, and `src/sites/legacy-route-selection.ts` are deleted. No route outside `/clones/<siteId>` renders a clone.

## Error boundaries

Errors thrown while rendering a clone route show the site-segment error UI and do not replace the selector or other route pages. Errors in the root layout, global CSS, dependency graph, or production build remain application-wide by design; this change does not pretend a single Next.js process provides process-level isolation.

## Theme and styles

The root document uses neutral metadata and no site-specific navigation stylesheet imports. Clone styles remain available to clone routes, while ChatGPT and Studio theme changes are moved from `document.documentElement` to local site wrappers. This prevents a route switch from changing the global document theme.

## Verification

- Pure tests verify the manifest generates exactly one selector link per site and that every link uses `/clones/<siteId>`.
- The existing site manifest tests continue to verify the three site IDs and navigation ownership.
- Typecheck, lint, full tests, and production build verify the App Router changes.
- Manual dev verification opens `/clones`, then each clone path on the same port and edits a site-owned file to confirm Fast Refresh.

