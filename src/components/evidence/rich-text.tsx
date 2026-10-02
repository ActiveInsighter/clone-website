import { Fragment, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { RichTextBlock, RichTextSpan } from "./types"
import "./editorial-widgets.css"

export interface RichTextProps {
  blocks: readonly RichTextBlock[]
  className?: string
}

/** Reject protocols and disguised schemes rather than delegating URL safety to the DOM. */
export function safeRichTextHref(value: string): string | undefined {
  const href = value.trim()
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return undefined
  if (href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"))) return href
  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href)
      return url.hostname && !url.username && !url.password ? href : undefined
    } catch {
      return undefined
    }
  }
  // Relative document paths are useful in portable component consumers.
  if (!href.startsWith("//") && !/^[^/?#]*:/.test(href)) return href
  return undefined
}

function markedSpan(span: RichTextSpan, links: RichTextBlock["links"]): ReactNode {
  let content: ReactNode = span.text.split("\n").map((line, index) => (
    <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>
  ))
  // Formatting is inside the link, so multiple annotations never create nested anchors.
  for (const mark of span.marks ?? []) {
    if (mark === "strong") content = <strong>{content}</strong>
    else if (mark === "em") content = <em>{content}</em>
    else if (mark === "code") content = <code>{content}</code>
    else if (mark === "sup") content = <sup>{content}</sup>
    else if (mark === "sub") content = <sub>{content}</sub>
  }
  for (const mark of span.marks ?? []) {
    const href = links?.[mark] && safeRichTextHref(links[mark])
    if (href) return <a href={href}>{content}</a>
  }
  return content
}

export function RichText({ blocks, className }: RichTextProps) {
  return (
    <div className={cn("evidence-rich-text", className)}>
      {blocks.map((block) => {
        if (block.code !== undefined) {
          return <pre key={block.id} className="evidence-rich-text__code"><code>{block.code}</code></pre>
        }
        const content = block.spans.map((span, index) => (
          <Fragment key={index}>{markedSpan(span, block.links)}</Fragment>
        ))
        const classes = cn("evidence-rich-text__block", block.style === "articleSummary" && "evidence-rich-text__summary")
        switch (block.style) {
          case "h2": return <h2 key={block.id} className={classes}>{content}</h2>
          case "h3": return <h3 key={block.id} className={classes}>{content}</h3>
          case "h4": return <h4 key={block.id} className={classes}>{content}</h4>
          case "blockquote": return <blockquote key={block.id} className={classes}>{content}</blockquote>
          default: return <p key={block.id} className={classes}>{content}</p>
        }
      })}
    </div>
  )
}
