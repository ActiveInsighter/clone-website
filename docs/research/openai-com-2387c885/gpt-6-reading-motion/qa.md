# Reading motion verification

Verified on 2026-10-09.

Preview: https://clone-website-lab.2212148739lbw.workers.dev/components/reading-motion

Cloudflare Worker version: `e3ae41b7-a1cb-4985-83d1-4b1aa10d7a1f`.

## Checks

- `npm test`: 81 tests passed, including geometry and portable package checks.
- `npm run check`: architecture checks, ESLint, TypeScript and production build passed.
- `npm run build:assets`: portable exports and static Next build passed.
- `npm run test:routes`: existing clone routes, both component galleries, root redirect and unknown-route 404 passed on the local static preview and deployed Cloudflare origin.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3091 npm run test:e2e`: all 21 browser tests passed.
- `PLAYWRIGHT_BASE_URL=https://clone-website-lab.2212148739lbw.workers.dev npm run test:e2e -- tests/browser/reading-motion.spec.ts`: all 8 reading motion tests passed. The gallery tests use the public deployment; component lifecycle tests use an isolated React StrictMode fixture.
- Actual `npx shadcn@latest add` installation into a separate temporary project with `#/pieces` component aliases created all 11 files in the configured directory; the installed source passed TypeScript checking.
- Local browser MCP confirmed the public reading evidence finishes with both measured lines fully selected, zero horizontal overflow, and no console errors or warnings.
- Public registry JSON and downloadable package returned HTTP 200 with their expected content types.
- `git diff --check`: passed.

## Covered behavior

Cross-line selection, replay and cancellation, reversible scroll animation, paragraph return to its natural position, mobile wrapping, automatic scrolling before playback, nested scroll roots, content remeasurement, React StrictMode remount, keyboard link focus, RTL selection direction and reduced motion.

## Visual references

See `docs/design-references/openai-com-2387c885/gpt-6-reading-motion/` for the supplied source screenshot and local desktop selection, paragraph movement and mobile reading screenshots.

## Integration contract

React 19 and CSS Modules are required. There is no Next.js runtime dependency. The shadcn registry installs the usual `clsx` and `tailwind-merge` utility dependencies. A moving paragraph may draw outside its own box; host layouts should leave room or clip horizontal overflow as documented in `docs/components/reading-motion.md`.
