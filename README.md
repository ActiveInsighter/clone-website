# AI Website Cloner Template

<a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a> <a href="https://github.com/JCodesMore/ai-website-cloner-template/stargazers"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a> <a href="https://discord.gg/hrTSX5yTpB"><img src="https://img.shields.io/discord/1400896964597383279?label=discord" alt="Discord" /></a> <img src="https://img.shields.io/endpoint?url=https://gittokens.rsamf.com/badge/JCodesMore/ai-website-cloner-template" alt="tokens" />

> English README | [中文说明](README.zh-CN.md)

A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. 

**Recommended: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with Opus 5.5 for best results** — also supports Codex, Cursor, and OpenCode.

Point it at a URL, run `/clone-website`, and your AI agent will inspect the site, extract design tokens and assets, write component specs, and dispatch parallel builders to reconstruct every section.

## Demo

[![Watch the demo](docs/design-references/comparison.png)](https://youtu.be/O669pVZ_qr0)

> Click the image above to watch the full demo on YouTube.

## Quick Start

> **Important:** Start by making your own copy with GitHub's **Use this template** button. Do not clone this template repository directly for your website project, and do not open pull requests here with your generated website.

1. **Create your own repository from this template**

   On the GitHub page for this project, click **Use this template**, then click **Create a new repository**.

   Give your new repository a name, choose whether it should be public or private, then click **Create repository**. If GitHub shows an **Include all branches** option, you can leave it off.

   This gives you your own separate project to work in, so your website changes stay in your account instead of coming back to the main template.

2. **Open your new repository on your computer**

   After GitHub creates your copy, open that new repository. Click **Code** and open or clone your new repository with your preferred coding tool.

   If you use the terminal, the command will look like this:

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-NEW-REPOSITORY.git
   cd YOUR-NEW-REPOSITORY
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start your AI agent** — Claude Code recommended:
   ```bash
   claude --chrome
   ```
5. **Run the skill**:
   ```
   /clone-website <target-url1> [<target-url2> ...]
   ```
6. **Customize** (optional) — after the base clone is built, modify as needed

> Using a different agent? Open `AGENTS.md` for project instructions — most agents pick it up automatically.

## Multi-site development

All website replicas share one Next.js development server and one port. Start it once:

```bash
npm run dev
```

Next.js 16 uses Turbopack by default for development, so the project does not need a separate bundler configuration. The dev server listens on port `3000` unless another port is supplied explicitly.

Then open the selector or any explicit clone route:

```text
http://localhost:3000/                  # redirects to the selector
http://localhost:3000/clones            # clone selector
http://localhost:3000/clones/openai
http://localhost:3000/clones/chatgpt
http://localhost:3000/clones/studio
http://localhost:3000/clones/gemini
```

Each clone has its own route entry and uses Next.js Fast Refresh during development. Unknown site paths return 404 instead of falling back to another clone.

## Supported Platforms

| Agent                                                         | Status                     |
| ------------------------------------------------------------- | -------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **Recommended** — Opus 5.5   |
| [OpenAI Codex Desktop / CLI](https://developers.openai.com/codex/) | Supported — repo skill + browser MCP |
| [OpenCode](https://opencode.ai/)                              | Supported                  |
| [Cursor](https://cursor.com/)                                 | Supported                  |

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- An AI coding agent (see [Supported Platforms](#supported-platforms))

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — default icons (replaced by extracted SVGs during cloning)

## How It Works

The `/clone-website` skill runs a multi-phase pipeline:

1. **Reconnaissance** — screenshots, design token extraction, interaction sweep (scroll, click, hover, responsive)
2. **Foundation** — updates fonts, colors, globals, downloads all assets
3. **Component Specs** — writes detailed spec files (`docs/research/<site-key>/<page-key>/components/`) with exact computed CSS values, states, behaviors, and content
4. **Parallel Build** — dispatches builder agents in git worktrees, one per section/component
5. **Assembly & QA** — merges worktrees, wires up the page, runs visual diff against the original

Each builder agent receives the full component specification inline — exact `getComputedStyle()` values, interaction models, multi-state content, responsive breakpoints, and asset paths. No guessing.

## Use Cases

- **Platform migration** — rebuild a site you own from WordPress/Webflow/Squarespace into a modern Next.js codebase
- **Lost source code** — your site is live but the repo is gone, the developer left, or the stack is legacy. Get the code back in a modern format
- **Learning** — deconstruct how production sites achieve specific layouts, animations, and responsive behavior by working with real code

## Not Intended For

- **Phishing or impersonation** — this project must not be used for deceptive purposes, impersonation, or any activity that breaks the law.
- **Passing off someone's design as your own** — logos, brand assets, and original copy belong to their owners.
- **Violating terms of service** — some sites explicitly prohibit scraping or reproduction. Check first.

## Project Structure

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons
  lib/utils.ts      # cn() utility
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target
  videos/           # Downloaded videos from target
  seo/              # Favicons, OG images
docs/
  research/         # Extraction output & component specs
  design-references/ # Screenshots
.agents/skills/clone-website/ # Canonical skill and inspection reference
.claude/commands/clone-website.md # Thin Claude Code bridge
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
```

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint check
npm run typecheck # TypeScript check
npm run check  # Run lint + typecheck + build
npm run test:routes # Verify production clone routes after building
```

### If using docker

```bash
docker compose up app --build # build and run the app
docker compose up dev --build # run the app in dev mode on port 3001
```

## Agent Support and Template Updates

The official template is synchronized to [v0.5.1](https://github.com/JCodesMore/ai-website-cloner-template/releases/tag/v0.5.1). The portable workflow lives in `.agents/skills/clone-website/`; Codex, Cursor, and OpenCode discover it directly. Claude Code uses `.claude/commands/clone-website.md`. Edit the canonical skill directly; generated copies and synchronization scripts are no longer used.

Open this repository in Codex with browser automation enabled and ask:

```text
Use the clone-website skill to clone https://example.com
```

This repository's existing multi-site routing conventions are in `AGENTS.md`. See [the upgrade record](docs/template-upgrade.md) for the pinned upstream revision and retained project behavior. Browser MCP must be configured in the agent; this repository does not supply a Codex MCP configuration.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JCodesMore/ai-website-cloner-template&type=Date)](https://star-history.com/#JCodesMore/ai-website-cloner-template&Date)

## License

MIT


## Evidence component library

Anthropic Opus 5.5: `/clones/anthropic/claude-opus-5-5`. Reusable component gallery: `/components/evidence`. See [component APIs and migration guide](docs/components/evidence.md) for shadcn tables, Recharts charts, themes and editorial interactions.
