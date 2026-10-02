"use client"

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
import { ComparisonCellContent, ComparisonTableViewport } from "./benchmark-table"
import type { PricingTableProps } from "./types"

export function PricingTable({ columns, rows, caption, className }: PricingTableProps) {
  const hasData = columns.length > 0 && rows.length > 0

  return (
    <ComparisonTableViewport caption={caption} className={cn("evidence-pricing", className)}>
      <Table className="evidence-comparison-table evidence-pricing-table" data-empty={!hasData || undefined}>
        <TableCaption className="evidence-comparison-sr-only">{caption}</TableCaption>
        <colgroup>
          <col className="evidence-pricing-column" />
          {columns.map((column) => <col key={column.id} className="evidence-pricing-column" />)}
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="evidence-comparison-label">{caption}</TableHead>
            {columns.map((column) => (
              <TableHead key={column.id} scope="col">
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
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <ComparisonCellContent cell={row.values[column.id]} />
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="evidence-comparison-empty">
                No pricing data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ComparisonTableViewport>
  )
}
