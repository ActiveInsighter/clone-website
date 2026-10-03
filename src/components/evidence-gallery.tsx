"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BenchmarkTable } from "./evidence/benchmark-table"
import { PricingTable } from "./evidence/pricing-table"
import { ChartTabs } from "./evidence/chart-tabs"
import { BenchmarkBarChart } from "./evidence/benchmark-bar-chart"
import { TestimonialTabs } from "./evidence/testimonial-tabs"
import { ResponseComparison } from "./evidence/response-comparison"
import type { ChartTab, ComparisonRow, ResponseExample, RichTextBlock, Testimonial } from "./evidence/types"
import "./evidence/evidence-theme.css"
import "./evidence-gallery.css"

const columns = [{ id: "current", label: "Current", description: "Our latest release" }, { id: "previous", label: "Previous" }, { id: "baseline", label: "Baseline" }]
const block = (id: string, text: string): RichTextBlock => ({ id, spans: [{ text }] })
const testimonials: Testimonial[] = [
  { id: "design", company: "Design", author: "A product designer", quote: [block("design-quote", "A good comparison lets the reader see what matters. Clear typography, thoughtful spacing, and honest scales make evidence feel approachable.")] },
  { id: "engineering", company: "Engineering", author: "A frontend engineer", quote: [block("engineering-quote", "One component, several datasets, and a small set of theme tokens. The presentation stays consistent as the product grows.")] },
  { id: "research", company: "Research", author: "A research lead", quote: [block("research-quote", "The numbers should remain inspectable. An exact-value table gives every chart a readable, portable alternative.")] },
]
const examples: ResponseExample[] = [{ id: "explain", label: "Explaining a design", prompt: "Explain why a logarithmic cost axis is useful.", left: { label: "Detailed answer", blocks: [block("detail", "A logarithmic axis allocates equal space to equal ratios. The interval from $1 to $10 occupies the same width as the interval from $10 to $100. This keeps inexpensive and expensive options readable in the same chart."), block("detail-two", "It requires positive values. Use a linear axis when zero or negative values are meaningful, and keep the scale clearly labeled.")] }, right: { label: "Concise answer", blocks: [block("concise", "A logarithmic axis compares ratios. It makes a wide range of positive costs easier to read without crowding the low-cost models.")] } }]

export function EvidenceGallery() {
  const [theme, setTheme] = useState<"paper" | "dark">("paper")
  const [dataset, setDataset] = useState<"quality" | "reliability">("quality")
  const [showLinear, setShowLinear] = useState(true)
  const scores = dataset === "quality" ? [92, 83, 71] : [96, 89, 78]
  const rows: ComparisonRow[] = [
    { id: "score", label: dataset === "quality" ? "Task quality" : "Reliability", description: "Higher is better", values: Object.fromEntries(columns.map((column, index) => [column.id, { value: `${scores[index]}%`, best: index === 0 }])) },
    { id: "latency", label: "Median latency", description: "Lower is better", values: { current: { value: "1.8s" }, previous: { value: "2.6s" }, baseline: { value: "1.2s", best: true } } },
    { id: "coverage", label: "Coverage", values: { current: { value: "42 tasks", best: true, note: "Expanded suite" }, previous: { value: "30 tasks" }, baseline: { value: null } } },
  ]
  const chart = {
    title: dataset === "quality" ? "Quality per dollar" : "Reliability per dollar",
    subtitle: "Illustrative data · equal spacing represents equal cost ratios",
    xAxis: { label: "Cost per task (USD · log scale)", domain: [0.1, 100] as const, ticks: [0.1, 1, 10, 100], scale: "log" as const, format: "currency" as const },
    yAxis: { label: "Score", domain: [40, 100] as const, ticks: [40, 60, 80, 100], format: "percent" as const },
    series: columns.map((column, index) => ({ id: column.id, label: column.label, color: ["var(--evidence-orange)", "var(--evidence-green)", "var(--evidence-gray)"][index], points: [0.3, 3, 30].map((x, effort) => ({ x: x * (1 + index * 0.6), y: scores[index] - (2 - effort) * 12, label: ["Low", "Medium", "High"][effort] })) })),
  }
  const tabs: ChartTab[] = [{ id: "cost", label: "Cost & performance", chart }, ...(showLinear ? [{ id: "linear", label: "Linear scale", chart: { ...chart, subtitle: "The same observations, with a linear cost axis", xAxis: { ...chart.xAxis, scale: "linear" as const, domain: [0, 100] as const, ticks: [0, 25, 50, 75, 100] } } }] : [])]
  return (
    <main data-evidence-theme={theme} className="evidence-gallery">
      <div className="evidence-gallery-inner">
        <nav className="evidence-gallery-nav" aria-label="组件库导航"><Link href="/clones">← Clone Lab</Link><Link href="/clones/anthropic/claude-opus-5-5">查看 Opus 5.5 复刻 ↗</Link></nav>
        <header className="evidence-gallery-header"><p className="evidence-gallery-eyebrow">A reusable presentation system</p><h1>Evidence</h1><p>优雅地呈现比较、数据和观点。基于 shadcn/ui 与 Recharts，让组件随你的数据和品牌一起变化。</p></header>
        <div className="evidence-gallery-controls" aria-label="展示选项">
          <div><span>主题</span><Button variant="outline" aria-pressed={theme === "paper"} onClick={() => setTheme("paper")}>Paper</Button><Button variant="outline" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</Button></div>
          <div><span>数据</span><Button variant="outline" aria-pressed={dataset === "quality"} onClick={() => setDataset("quality")}>Quality</Button><Button variant="outline" aria-pressed={dataset === "reliability"} onClick={() => setDataset("reliability")}>Reliability</Button><Button variant="outline" aria-pressed={showLinear} onClick={() => setShowLinear(value => !value)}>Linear comparison</Button></div>
        </div>
        <p className="evidence-gallery-disclaimer">本页为组件演示数据；复刻页面使用从原站提取的真实内容与数值。</p>
        <section className="evidence-gallery-section"><h2>01 / Comparison tables</h2><p>明确的列高亮、按单元格标注最优结果，移动端保持关键列可见。</p><BenchmarkTable columns={columns} rows={rows} highlightColumn="current" caption="Illustrative model comparison" note="支持任意列、文本或数字、缺失值与单元格注释。" /><PricingTable columns={columns.slice(0, 2)} caption="Illustrative pricing · USD per million tokens" rows={[{ id: "input", label: "Input", values: { current: { value: "$2" }, previous: { value: "$3" } } }, { id: "output", label: "Output", values: { current: { value: "$10" }, previous: { value: "$15" } } }]} /></section>
        <section className="evidence-gallery-section"><h2>02 / Numeric charts</h2><p>真实数值坐标、对数轴、可切换系列、悬浮详情与可展开的数据表。</p><ChartTabs tabs={tabs} /><BenchmarkBarChart title="A simpler view" subtitle="Illustrative data · categorical comparison" data={columns.map((column, index) => ({ id: column.id, label: column.label, value: scores[index], highlight: index === 0 }))} valueAxis={{ label: "Score", domain: [0, 100], ticks: [0, 25, 50, 75, 100], format: "percent" }} /></section>
        <section className="evidence-gallery-section"><h2>03 / Editorial interactions</h2><p>客户引述与可播放的回答比较。切换时保持内容完整，并尊重减少动画设置。</p><TestimonialTabs items={testimonials} label="Demonstration testimonials" /><ResponseComparison examples={examples} /></section>
        <section className="evidence-gallery-section evidence-gallery-integration"><h2>Bring it into your project</h2><p>组件只接收类型化数据，通过 CSS 变量定制。复制组件和对应的 shadcn 基础组件，即可在其他 React / Next.js 项目中使用。</p><p><a className="evidence-gallery-download" href="/downloads/evidence-kit.tar.gz" download>下载独立组件包 ↗</a> · 源码、编译文件、类型与使用说明</p><pre><code>{`import { BenchmarkTable, CostPerformanceChart } from "@/components/evidence"\nimport "@/components/evidence/evidence-theme.css"\n\n<div data-evidence-theme="paper">\n  <BenchmarkTable columns={columns} rows={rows}\n    highlightColumn="current" caption="Model comparison" />\n  <CostPerformanceChart {...chart} />\n</div>`}</code></pre><p>完整依赖、API 和迁移说明见项目内 <code>docs/components/evidence.md</code>。</p></section>
      </div>
    </main>
  )
}
