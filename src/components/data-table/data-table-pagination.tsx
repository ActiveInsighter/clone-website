"use client"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  DataTableClassNames,
  DataTableInstance,
  DataTableRecord,
} from "./types"

type DataTablePaginationProps<T extends DataTableRecord> = {
  table: DataTableInstance<T>
  pagination: PaginationState
  pageSizeOptions?: number[]
  showFirstLastButtons?: boolean
  recordsLabel?: string
  classNames?: DataTableClassNames
}

export function DataTablePagination<T extends DataTableRecord>({
  table,
  pagination,
  pageSizeOptions,
  showFirstLastButtons = false,
  recordsLabel = "records",
  classNames,
}: DataTablePaginationProps<T>) {
  const { pageIndex, pageSize } = pagination
  const pageCount = table.getPageCount()
  const totalRows = table.getRowCount()
  const hasKnownPageCount = pageCount >= 0

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground/90",
        classNames?.pagination,
      )}
    >
      <span>
        Page {pageIndex + 1}
        {hasKnownPageCount ? ` of ${Math.max(pageCount, 1)}` : ""} ·{" "}
        {totalRows.toLocaleString()} {recordsLabel}
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        {pageSizeOptions?.length ? (
          <label className="hidden items-center gap-2 sm:flex">
            <span>Rows</span>
            <select
              aria-label="Rows per page"
              className="h-7 rounded-md border border-input bg-background px-2 text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              value={pageSize}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="flex items-center gap-1">
          {showFirstLastButtons ? (
            <Button
              aria-label="First page"
              className="hidden size-7 text-foreground/65 hover:bg-foreground/10 hover:text-foreground sm:inline-flex"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.firstPage()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronsLeft className="size-4" />
            </Button>
          ) : null}
          <Button
            aria-label="Previous page"
            className="size-7 text-foreground/65 hover:bg-foreground/10 hover:text-foreground"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label="Next page"
            className="size-7 text-foreground/65 hover:bg-foreground/10 hover:text-foreground"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="size-4" />
          </Button>
          {showFirstLastButtons ? (
            <Button
              aria-label="Last page"
              className="hidden size-7 text-foreground/65 hover:bg-foreground/10 hover:text-foreground sm:inline-flex"
              disabled={!hasKnownPageCount || !table.getCanNextPage()}
              onClick={() => table.lastPage()}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronsRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
