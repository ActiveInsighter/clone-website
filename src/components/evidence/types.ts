import type { ReactNode } from "react"

export interface ComparisonColumn {
  id: string
  label: string
  description?: string
}

export interface ComparisonValue {
  value: string | number | null
  note?: string
  best?: boolean
}

export interface ComparisonRow {
  id: string
  label: string
  description?: string
  values: Readonly<Record<string, ComparisonValue>>
}

export interface BenchmarkTableProps {
  columns: readonly ComparisonColumn[]
  rows: readonly ComparisonRow[]
  highlightColumn?: string
  caption: string
  note?: ReactNode
  className?: string
}

export interface PricingTableProps {
  columns: readonly ComparisonColumn[]
  rows: readonly ComparisonRow[]
  caption: string
  className?: string
}

export interface ChartPoint {
  x: number
  y: number
  label?: string
  labelPlacement?: "above" | "below" | "hidden"
}

export interface ChartSeries {
  id: string
  label: string
  color: string
  points: readonly ChartPoint[]
}

export interface ChartAxis {
  label: string
  domain: readonly [number, number]
  ticks: readonly number[]
  scale?: "linear" | "log"
  format?: "number" | "percent" | "currency"
}

export interface CostPerformanceChartProps {
  title: string
  subtitle?: string
  series: readonly ChartSeries[]
  xAxis: ChartAxis
  yAxis: ChartAxis
  note?: ReactNode
  animated?: boolean
  className?: string
}

export interface ChartTab {
  id: string
  label: string
  chart: Omit<CostPerformanceChartProps, "className">
}

export interface RichTextSpan {
  text: string
  marks?: readonly string[]
}

export interface RichTextBlock {
  id: string
  style?: string
  spans: readonly RichTextSpan[]
  links?: Readonly<Record<string, string>>
  code?: string
}

export interface Testimonial {
  id: string
  company: string
  author: string
  role?: string
  quote: readonly RichTextBlock[]
}

export interface TestimonialTabsProps {
  items: readonly Testimonial[]
  label?: string
  className?: string
}

export interface ResponseExample {
  id: string
  label: string
  prompt: string
  left: { label: string; blocks: readonly RichTextBlock[] }
  right: { label: string; blocks: readonly RichTextBlock[] }
}

export interface ResponseComparisonProps {
  examples: readonly ResponseExample[]
  className?: string
}
