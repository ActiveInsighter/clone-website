# Evidence components

Preview: `/components/evidence`. Source clone: `/clones/anthropic/claude-opus-5-5`.

The presentation library lives in `src/components/evidence/`. It accepts caller-supplied data and has no dependency on the Anthropic article, router, backend, fonts, or assets. The article adapter and extracted source data live separately under `src/components/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/`. The gallery uses explicitly illustrative data.

## Use in this project

```tsx
import { BenchmarkTable, CostPerformanceChart } from "@/components/evidence"
import type { ComparisonRow, ChartSeries } from "@/components/evidence"
import "@/components/evidence/evidence-theme.css"

const columns = [{ id: "new", label: "Current" }, { id: "old", label: "Previous" }]
const rows: ComparisonRow[] = [{
  id: "quality", label: "Quality", description: "Higher is better",
  values: { new: { value: "92%", best: true }, old: { value: "83%" } },
}]
const series: ChartSeries[] = [{
  id: "new", label: "Current", color: "var(--evidence-orange)",
  points: [{ x: 1, y: 70, label: "Low" }, { x: 10, y: 92, label: "High" }],
}]

export function Results() {
  return <section data-evidence-theme="paper">
    <BenchmarkTable columns={columns} rows={rows} highlightColumn="new"
      caption="Model quality comparison" note="Illustrative results." />
    <CostPerformanceChart title="Quality per dollar" series={series}
      xAxis={{ label: "Cost (USD · log scale)", domain: [0.1, 100],
        ticks: [0.1, 1, 10, 100], scale: "log", format: "currency" }}
      yAxis={{ label: "Score", domain: [0, 100],
        ticks: [0, 25, 50, 75, 100], format: "percent" }} />
  </section>
}
```

## Copy into another project

### 独立组件包

```bash
npm run export:evidence
```

会生成 `dist/evidence-kit/` 和 `dist/evidence-kit.tar.gz`，并更新展示页上的下载包。包内包含 8 个组件的源码、编译后的 ESM、TypeScript 类型、六个必要的 shadcn 基础组件、工具函数、主题 CSS 和使用说明，已移除本项目的路径别名。包内不包含 Anthropic 图片、字体、页面或 Next.js 路由。

你可以复制包内的 `src/components/` 和 `src/lib/`，也可以在其他项目中用 `npm install /absolute/path/evidence-kit` 安装本地包：

```tsx
import { BenchmarkTable, CostPerformanceChart } from "@clone-lab/evidence"
import "@clone-lab/evidence/theme.css"
```

安装为包时，在宿主 Tailwind v4 入口添加 `@source "../node_modules/@clone-lab/evidence/src";`，路径以该 CSS 文件的位置为准。现有 shadcn 项目保留已有的 Tailwind 基础样式；新项目可以导入包内的 `styles.css`。修改包源码后，在包目录执行 `npm install`、`npm run build` 重新生成编译文件和类型。独立导出会实际执行严格 TypeScript 编译；测试也会检查 CSS 能独立通过 Tailwind 处理。

### 手动复制

1. Use a React 19 project with Tailwind v4 and shadcn/ui. The components support Next.js App Router server pages; interactive components declare `"use client"`. This project uses shadcn's **Base UI** primitives. Its Tabs API uses `keepMounted`, `data-active`, and `data-inactive`; copying only the evidence components into a Radix-based shadcn setup requires adapting those APIs.
2. Install `recharts` (verified with 3.8.0), `lucide-react`, `@base-ui/react`, `class-variance-authority`, `clsx`, and `tailwind-merge`.
3. Copy `src/components/evidence/`, `src/lib/utils.ts`, and the required shadcn files: `ui/table.tsx`, `ui/card.tsx`, `ui/button.tsx`, `ui/tabs.tsx`, `ui/chart.tsx`, and `ui/collapsible.tsx`. Preserve their dependencies and your Tailwind/shadcn global CSS. These are editable source components, not an opaque package.
4. Preserve the `@/*` alias or replace it with your project's import paths. Import `evidence-theme.css` once and wrap consumers in `data-evidence-theme="paper"` or `"dark"`. Each component imports its own layout CSS. No Anthropic font files or branding are needed.
5. Pass your own typed data. Stable, unique IDs are required for columns, rows, chart series, tabs, testimonials, and examples. To extract a smaller subset, follow its imports rather than copying the article adapter.

## Component API

| Component | Inputs | Behavior |
| --- | --- | --- |
| `BenchmarkTable` | `columns`, `rows`, `caption`, optional `highlightColumn`, `note`, `className` | Semantic table, per-cell winners, optional outlined subject column; row labels and subject pin on narrow screens. |
| `PricingTable` | `columns`, `rows`, `caption`, optional `className` | Compact comparison; supplied price strings and precision remain unchanged. |
| `CostPerformanceChart` | `title`, `series`, `xAxis`, `yAxis`, optional `subtitle`, `note`, `animated`, `className` | Connected numeric scatter plot, logarithmic or linear axes, legend toggles, point tooltip, accessible exact-value table. |
| `ChartTabs` | `tabs: ChartTab[]`, optional `className` | Keyboard-operable shadcn tabs, independent chart instances, reserved panel height. |
| `BenchmarkBarChart` | `title`, `data`, `valueAxis`, optional `subtitle`, `valueLabel`, `note`, `animated`, `className` | Categorical horizontal bars. A linear axis with zero baseline gives a meaningful bar length. |
| `TestimonialTabs` | `items`, optional `label`, `className` | Company tabs, full rich quotes and metadata, decorative inert preview card. |
| `ResponseComparison` | `examples`, optional `className` | Two independently scrollable responses; play, pause, resume, replay; changing example resets playback and cleans timers. |
| `RichText` | `blocks`, optional `className` | Structured spans, semantic headings, links, emphasis and code without raw HTML injection. |

Type definitions are in `types.ts`; bar-specific types are in `benchmark-bar-chart.tsx`. `ComparisonValue.value` accepts strings, numbers, or null. Missing values render an em dash. `best` is explicit data supplied by the caller: the component never infers a winner from a display string. `note` accepts React content for citations or a methodology explanation.

`ChartPoint` uses actual numeric `x` and `y`, not category positions. Axis domains must be finite and ascending; logarithmic domains and coordinates must be positive. A percent axis expects numbers on a **0–100** scale. `format` changes labels, never coordinates. `labelPlacement` can be `above`, `below`, or `hidden`. Keep units explicit and select domains that include the observations. Non-finite or invalid logarithmic points are excluded with a visible warning; malformed axes show a clear empty state.

## Theme and typography

Set theme variables on a wrapper through a class in your stylesheet:

```css
.my-results[data-evidence-theme] {
  --evidence-highlight-line: #7450d0;
  --evidence-highlight: #e6dff9;
  --evidence-orange: #7450d0;
  --evidence-sans: "Your Sans", system-ui, sans-serif;
  --evidence-serif: "Your Serif", Georgia, serif;
  --evidence-mono: ui-monospace, monospace;
}
```

Other tokens: `--evidence-paper`, `--evidence-ink`, `--evidence-muted`, `--evidence-line`, `--evidence-grid`, `--evidence-winner`, `--evidence-green`, `--evidence-yellow`, `--evidence-gray`, and `--evidence-gray-light`. Internal components inherit the wrapper theme, so separate paper and dark instances can coexist. Prose typography belongs to the page consuming `RichText`; the library supplies marks and code presentation.

Charts animate on entry with IntersectionObserver; `animated={false}` disables entry animation. The library respects `prefers-reduced-motion`; response comparisons immediately display the complete supplied text under that setting. This playback is a local presentation effect, not an API stream. Full response text remains available to screen readers throughout normal playback.

## Validation and source notes

`npm test` checks extracted source completeness, chart scale validation and rich-text safety. `npm run check` runs lint, types and production build. `npm run test:routes` verifies registered clones over HTTP. After building, run `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` here; elsewhere install a Playwright browser and omit that variable.

Source research, data and visual comparisons are retained under `docs/research/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/` and its corresponding design-reference directory. The hero uses native WebGL with three downloaded artworks, measured panoramic geometry and accessible HTML lettering. It includes a CSS artwork fallback, context restoration, reduced-motion behavior and resource cleanup. Source scroll locking and procedural grain animation are deliberately simplified; the local expansion preserves native scrolling. Tables, charts, article content and component interactions use the extracted source data.
