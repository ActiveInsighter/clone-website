"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import type { SaasTableFeatures } from "./table-features"
import type { IdentifiableRecord } from "./types"

export function TablePagination<T extends IdentifiableRecord>({
  table,
  currentPage,
}: {
  table: Table<SaasTableFeatures, T>
  currentPage: number
}) {
  const pageCount = table.getPageCount()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-[30px] py-3 text-xs text-white/45 max-[700px]:px-5">
      <span>
        Page {currentPage} of {Math.max(pageCount, 1)} · {table.getFilteredRowModel().rows.length} records
      </span>
      <div className="flex items-center gap-1">
        <Button
          aria-label="Previous page"
          className="size-7 text-white/65 hover:bg-white/8 hover:text-white"
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
          className="size-7 text-white/65 hover:bg-white/8 hover:text-white"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
