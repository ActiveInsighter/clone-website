# Output plan

Source: https://anthropic.com/claude-opus-5-5 (redirects to https://www.anthropic.com/claude-opus-5-5).
Application: `/workspace/projects/clone-website`, existing combined multi-site app.
Site ID: `anthropic`; site key: `www-anthropic-com-b19f62ae`; page key: `claude-opus-5-5-ad96d446`.
Local URL: `/clones/anthropic/claude-opus-5-5`.
Research/screenshots/assets use this site/page namespace. Page components live in `src/components/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/`.
Reusable components live in `src/components/evidence/` and use existing shadcn UI primitives plus the official shadcn chart wrapper and Recharts.
A separate `/components/evidence` gallery will demonstrate theme changes and replacement datasets without depending on page content.
Existing roots, routes, component owners, assets and research remain intact; static route generation will derive the source pathname from the new manifest defaultPath.
No new application or global font/palette replacement. Anthropic fonts and tokens are route-scoped. CSS in the reusable library uses its own `--evidence-*` contract.
The user explicitly requests abstraction, reuse and custom animation; those requirements extend the skill's default emulation-only scope.
Browser MCP is unavailable in this environment; actual Chromium + Playwright automation performs DOM/computed-style extraction, state inspection and screenshot comparison.
