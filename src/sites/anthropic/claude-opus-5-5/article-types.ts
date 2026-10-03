import type { BenchmarkTableProps, ChartTab, PricingTableProps, ResponseExample, RichTextBlock, Testimonial } from "@/components/evidence/types"

export type ArticleNode =
  | { id: string; type: "text"; block: RichTextBlock }
  | { id: string; type: "anchor"; anchor: string; label: string; heroLabel: string }
  | ({ id: string; type: "benchmark"; notes: readonly RichTextBlock[] } & Omit<BenchmarkTableProps, "note" | "className">)
  | ({ id: string; type: "pricing" } & PricingTableProps)
  | { id: string; type: "charts"; tabs: readonly (ChartTab & { notes: readonly RichTextBlock[] })[] }
  | { id: string; type: "testimonials"; items: readonly Testimonial[] }
  | { id: string; type: "responses"; examples: readonly ResponseExample[] }
