# Completion and visual verification

Source: https://www.anthropic.com/claude-opus-5-5.
Destination: `/clones/anthropic/claude-opus-5-5`.
Reusable demonstration: `/components/evidence`.

The complete article is rendered from 68 structured nodes across four in-page sections, with the source header, scroll-driven hero, reading navigation and full footer. It includes nine benchmark rows, four pricing rows, six numeric charts containing 130 points, 21 testimonial states and three paired response examples. Eleven local assets were downloaded: seven fonts, three artworks and the favicon. Five specifications cover the tables, charts, editorial widgets, page shell and hydrated hero. The corrected hero inspection is recorded in `hero-live-states.json` and `hero-settings.json`.

Eight product-neutral components are exported from `src/components/evidence/index.ts`: BenchmarkTable, PricingTable, CostPerformanceChart, ChartTabs, BenchmarkBarChart, TestimonialTabs, ResponseComparison and RichText. The existing clone picker cards are also refactored into DestinationCard using shadcn Card. The article is a consumer of this library; the gallery uses independent illustrative data. Migration instructions are in `docs/components/evidence.md`.

## Checks completed

- `npm test`: 70 passing tests, including source content completeness, numeric and logarithmic coordinates, rich-text safety, panorama crop coverage, actual independent component compilation, Tailwind CSS compilation, export destination protection and existing application contracts.
- `npm run check`: ESLint, strict TypeScript and production build pass.
- `npm run test:routes`: original OpenAI, ChatGPT, Studio and Gemini routes, the new Anthropic page and the gallery return 200. Unknown site IDs return 404. The home redirect and picker links remain correct.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`: ten Chromium tests pass against production output. They cover desktop dropdown destinations and dismissal, chart legend toggling and exact data, keyboard chart tabs, independent chart IDs, replacement data, inherited dark theme, quote switching, play/pause/resume/replay/reset, phone scrolling with complete competitor visibility, mobile Sheet dismissal and reduced motion. Additional checks cover the hydrated WebGL hero, sticky geometry, retained expansion, context loss and restoration, WebGL-unavailable artwork fallback, Claude destination menus, menu dismissal across breakpoints, removing the selected chart tab and downloading the independent archive.
- `npm run export:evidence` and `npm run build --prefix dist/evidence-kit`: the product-neutral package compiles with declarations, CSS and its own build script. `/downloads/evidence-kit.tar.gz` contains editable source, compiled ESM, types, dependencies and usage instructions.
- `npm audit`: zero vulnerabilities.
- Manual Chromium capture at 1440px, 768px and 390px; no page errors and no body horizontal overflow. All six chart states captured individually and compared to source screenshots. Fonts, table widths, highlights, line colors, coordinates and article content reviewed.

Reproduce screenshots with a local server running:

```bash
CHROMIUM_PATH=/usr/bin/chromium node scripts/capture-opus-qa.cjs
```

Saved comparisons are under the corresponding `docs/design-references/` directory: `clone-desktop.png`, `clone-768.png`, `clone-390.png`, `clone-benchmark.png`, `clone-chart-1-1.png` through `clone-chart-2-3.png`, `clone-testimonial.png`, `clone-responses.png`, `clone-hero-intro-1440.png` / `clone-hero-settled-1440.png` and corresponding 768/390 hero states, and paper/dark gallery captures. Hydrated source hero states are retained as `source-hero-hydrated-intro.png` and `source-hero-hydrated-settled.png`; the original article and chart screenshots remain alongside them.

## Deliberate adaptations and fidelity limits

The hydrated source hero is recreated with native WebGL, all three local artworks, measured source horizon circles, panoramic crop alignment and textured semantic HTML lettering using the source Claude glyph. The sticky stage is 100lvh inside a 120lvh section. A first scroll starts expansion, and returning to the top retains the settled title. WebGL-unavailable devices and lost contexts retain the CSS artwork; restored contexts rebuild GPU resources. Rendering pauses offscreen, and all observers, listeners and GPU allocations are cleaned up on unmount.

The source's scroll locking, automatic scroll-position correction and procedural grain animation are simplified. The local hero preserves native scrolling and respects reduced motion with a static settled stage. Source shader behavior is reconstructed rather than copied verbatim, so fine distortion and animated grain can differ.

Phone benchmark columns are compacted so pinned row labels and the highlighted model leave room to read an entire competitor column. Charts additionally provide expandable exact-value tables. Response playback animates the extracted complete answers locally, with full accessible text and timer cleanup. These changes support the user's request for reusable, high-quality components.

Navigation uses real source destinations. Desktop Research, Commitments and Learn dropdown groups are reproduced with shadcn Menu; mobile navigation uses expanding groups in a shadcn Sheet. Try Claude opens its real destination directly; the adjacent button reproduces the About Claude, Models and Log in menu. Mobile navigation includes the original log-in and app-download destinations, and menus close when switching between desktop and phone layouts. Privacy choices links to the official privacy page rather than reproducing the source consent service. External pages, consent infrastructure and model APIs are outside this local page clone.
