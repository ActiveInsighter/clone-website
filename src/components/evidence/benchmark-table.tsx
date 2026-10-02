"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { BenchmarkTableProps, ComparisonValue } from "./types"

import "./comparison-table.css"

interface ComparisonTableViewportProps {
  caption: string
  children: ReactNode
  className?: string
}

/** Owns scrolling so the shadcn table container never overflows the page. */
export function ComparisonTableViewport({
  caption,
  children,
  className,
}: ComparisonTableViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const descriptionId = useId()
  const [overflow, setOverflow] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const update = () => {
      const remaining = viewport.scrollWidth - viewport.clientWidth
      setOverflow(remaining > 1)
      setCanScrollRight(remaining - viewport.scrollLeft > 1)
      // Native tables distribute extra width when the number of columns changes.
      // Use the rendered row-header width rather than assuming a fixed offset.
      const label = viewport.querySelector<HTMLElement>("thead .evidence-comparison-label")
      if (label) {
        viewport.style.setProperty("--evidence-pinned-offset", `${label.getBoundingClientRect().width}px`)
      }
    }
    const frame = requestAnimationFrame(update)
    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(update)
    observer?.observe(viewport)
    const table = viewport.querySelector("table")
    if (table) observer?.observe(table)
    const label = viewport.querySelector("thead .evidence-comparison-label")
    if (label) observer?.observe(label)
    viewport.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      viewport.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div className={cn("evidence-comparison", className)}>
      <div
        ref={viewportRef}
        className="evidence-comparison-viewport"
        role="region"
        aria-label={caption}
        aria-describedby={overflow ? descriptionId : undefined}
        tabIndex={overflow ? 0 : undefined}
        data-overflow={overflow || undefined}
      >
        {children}
      </div>
      {overflow && (
        <p id={descriptionId} className="evidence-comparison-scroll-hint">
          <span aria-hidden="true">{canScrollRight ? "→" : "←"}</span>
          <span>Scroll to compare<span className="evidence-comparison-sr-only"> all columns. Use the arrow keys when focused.</span></span>
        </p>
      )}
    </div>
  )
}

/** Render caller-supplied display strings verbatim, including currency precision. */
export function ComparisonCellContent({ cell }: { cell?: ComparisonValue }) {
  return (
    <>
      <span className={cn("evidence-comparison-value", cell?.best && "evidence-comparison-value-best")}>
        {cell?.value ?? "—"}
      </span>
      {cell?.note && <span className="evidence-comparison-qualifier">{cell.note}</span>}
    </>
  )
}

export function BenchmarkTable({
  columns,
  rows,
  highlightColumn,
  caption,
  note,
  className,
}: BenchmarkTableProps) {
  const hasData = columns.length > 0 && rows.length > 0

  return (
    <figure className={cn("evidence-benchmark", className)}>
      <ComparisonTableViewport caption={caption}>
        <Table className="evidence-comparison-table evidence-benchmark-table" data-empty={!hasData || undefined}>
          <TableCaption className="evidence-comparison-sr-only">{caption}</TableCaption>
          <colgroup>
            <col className="evidence-benchmark-label-column" />
            {columns.map((column) => <col key={column.id} className="evidence-benchmark-value-column" />)}
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="evidence-comparison-label">
                <span className="evidence-comparison-sr-only">Benchmark</span>
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  scope="col"
                  className={cn(column.id === highlightColumn && "evidence-comparison-highlight")}
                >
                  <span className="evidence-comparison-heading">{column.label}</span>
                  {column.description && <span className="evidence-comparison-qualifier">{column.description}</span>}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasData ? rows.map((row) => (
              <TableRow key={row.id}>
                <TableHead scope="row" className="evidence-comparison-label">
                  <span className="evidence-comparison-heading">{row.label}</span>
                  {row.description && <span className="evidence-comparison-description">{row.description}</span>}
                </TableHead>
                {columns.map((column) => {
                  const cell = row.values[column.id]
                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.id === highlightColumn && "evidence-comparison-highlight",
                        cell?.best && "evidence-comparison-winner",
                      )}
                    >
                      <ComparisonCellContent cell={cell} />
                    </TableCell>
                  )
                })}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="evidence-comparison-empty">
                  No benchmark data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ComparisonTableViewport>
      {note && <figcaption className="evidence-comparison-note">{note}</figcaption>}
    </figure>
  )
}
