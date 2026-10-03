import { PortalScope } from "@/components/portal-scope"

import { BenchmarkTable } from "@/components/evidence/benchmark-table"
import { PricingTable } from "@/components/evidence/pricing-table"
import { ChartTabs } from "@/components/evidence/chart-tabs"
import { TestimonialTabs } from "@/components/evidence/testimonial-tabs"
import { ResponseComparison } from "@/components/evidence/response-comparison"
import { RichText } from "@/components/evidence/rich-text"
import "@/components/evidence/evidence-theme.css"
import { articleNodes } from "./article-data"
import type { ArticleNode } from "./article-types"
import { OpusHeader, OpusReadingNav } from "./opus-navigation"
import { OpusHero } from "./opus-hero"
import { OpusFooter } from "./opus-footer"
import "./opus-page.css"

const sections = articleNodes.flatMap((node) => node.type === "anchor" ? [node] : [])

function headingId(node: Extract<ArticleNode, { type: "text" }>) {
  if (!node.block.style?.startsWith("h")) return undefined
  return node.block.spans.map((span) => span.text).join("").toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

function ArticleContent({ node }: { node: ArticleNode }) {
  switch (node.type) {
    case "anchor":
      return <div id={node.anchor} className="opus-section-anchor" data-opus-section={node.anchor} />
    case "text": {
      const id = headingId(node)
      // Section markers own their IDs; subheadings retain the source slugs.
      const headingOwnsId = !sections.some((section) => section.anchor === id)
      return (
        <div id={headingOwnsId ? id : undefined} className={`opus-prose-block${node.block.style === "articleSummary" ? " opus-summary" : ""}`}>
          <RichText blocks={[node.block]} />
        </div>
      )
    }
    case "benchmark":
      return (
        <div className="opus-figure opus-benchmarks">
          <BenchmarkTable columns={node.columns} rows={node.rows} highlightColumn={node.highlightColumn} caption={node.caption} note={<RichText blocks={node.notes} />} />
        </div>
      )
    case "pricing":
      return <div className="opus-prose-block opus-pricing"><PricingTable columns={node.columns} rows={node.rows} caption={node.caption} /></div>
    case "charts":
      return (
        <div className="opus-figure opus-charts">
          <ChartTabs tabs={node.tabs.map(({ notes, ...tab }) => ({ ...tab, chart: { ...tab.chart, note: <RichText blocks={notes} /> } }))} />
        </div>
      )
    case "testimonials":
      return <div className="opus-figure opus-testimonials"><TestimonialTabs items={node.items} /></div>
    case "responses":
      return <div className="opus-figure opus-responses"><ResponseComparison examples={node.examples} /></div>
  }
}

/** The source article is composed from product-neutral, data-driven evidence components. */
export function OpusPage() {
  return (
    <PortalScope className="opus-page" data-clone-site="anthropic" data-evidence-theme="paper" lang="en">
      <OpusHeader />
      <OpusHero sections={sections} />
      <main id="main-content" className="opus-main" tabIndex={-1}>
        <OpusReadingNav sections={sections} />
        <article aria-label="Introducing Claude Opus 5.5" className="opus-article">
          {articleNodes.map((node) => <ArticleContent key={node.id} node={node} />)}
        </article>
      </main>
      <OpusFooter />
    </PortalScope>
  )
}
