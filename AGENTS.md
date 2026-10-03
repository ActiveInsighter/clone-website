<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. The Next.js + shadcn/ui + Tailwind v4 base is pre-scaffolded — use the platform's `clone-website` skill or command with one or more URLs (for example, `/clone-website <url1> [<url2> ...]` where supported).

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React (default — will be replaced/supplemented by extracted SVGs)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Deployment:** Cloudflare Workers Static Assets (`npm run build:assets` then `npx wrangler deploy`); standalone build retained

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build
- `npm run test:routes` — Verify built clone routes over HTTP

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Pixel-perfect emulation** — match the target's spacing, colors, typography exactly
- **No personal aesthetic changes during emulation phase** — match 1:1 first, customize later
- **Real content** — use actual text and assets from the target site, not placeholders
- **Beauty-first** — every pixel matters

## Project Structure
```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons as React components
  lib/
    utils.ts        # cn() utility (shadcn)
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target site
  videos/           # Downloaded videos from target site
  seo/              # Favicons, OG images, webmanifest
docs/
  research/         # Inspection output (design tokens, components, layout)
  design-references/ # Screenshots and visual references
scripts/            # Asset download scripts
.agents/skills/clone-website/ # Canonical workflow and inspection reference
.claude/commands/clone-website.md # Thin Claude Code bridge
```

## Agent Workflow
- `.agents/skills/clone-website/SKILL.md` is the canonical upstream cloning workflow for Codex, Cursor, and OpenCode.
- `.claude/commands/clone-website.md` is a thin Claude Code bridge. Keep workflow instructions in the canonical skill rather than duplicating them across agents.
- Read `.agents/skills/clone-website/references/inspection-guide.md` on demand during inspection.
- When launching agent teams, keep each teammate in its own worktree branch and merge with the full project context.

## Existing Multi-Site Project
This repository already uses one Next.js application and one server for OpenAI, ChatGPT, Studio, and Gemini. Apply these project conventions when following the upstream skill:

- Keep `/` as the redirect to `/clones`, and keep `/clones` as the site picker. These are user-authored routes, not untouched template scaffold.
- Map new source pathnames under `/clones/<siteId>/<source-path>` using the existing `src/app/clones/[siteId]/[[...path]]/page.tsx` entry. A source `/` maps to `/clones/<siteId>`. Record the source URL, site ID, and local route in the output plan.
- Keep site entry points under `src/sites/<siteId>/`; register new sites in `src/sites/manifest.ts` and `src/sites/loaders.ts`. Extend their routing contracts as needed without replacing the shared route entry for a single clone.
- Reuse the established component owners in the site manifest when updating an existing site. Use the upstream collision-resistant namespaces for new research, screenshots, components, assets, and downloaders; preserve the existing artifact paths.
- Scope each site's fonts, CSS tokens, animations, and metadata to its route or `[data-clone-site]` wrapper. Use the existing combined application for additional sites unless the user requests another architecture.
- An explicit request to update an existing clone authorizes that route update. For a request to add a clone, choose a unique site ID and check for collisions before writing.
- Verify `/clones/openai`, `/clones/chatgpt`, `/clones/studio`, and `/clones/gemini` remain available, and unknown site IDs return 404.
- Run `npm test`, `npm run check`, and `npm run test:routes` after application or dependency changes.

## Site architecture and asset deployment

- Read `docs/site-architecture.md` before adding a clone or changing site boundaries.
- Site-private components, data, navigation config and CSS belong in `src/sites/<siteId>/`. Shared `src/components/` libraries must not import site-private implementations.
- Keep each site’s supported source paths in its own manifest/routes. Use `getCloneHref` for clone-local links.
- Use CSS Modules for new site styles; moving global stylesheet imports alone does not isolate CSS across client navigation.
- `npm run lint` includes the TypeScript-resolved architecture check.
- For Cloudflare deployment, run `npm run build:assets`, verify `out/` through `npm run preview:assets`, and run route/browser checks with `CLONE_BASE_URL` / `PLAYWRIGHT_BASE_URL`.
- Keep tokens and account credentials outside the repository.
