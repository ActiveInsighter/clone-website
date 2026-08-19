"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Database,
  EllipsisVertical,
} from "lucide-react"
import {
  flexRender,
  useTable,
  type ColumnVisibilityState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { BulkActionBar } from "./bulk-action-bar"
import {
  getPocketBaseSort,
  recordMatchesQuery,
  selectPocketBaseRange,
  togglePocketBaseSelection,
} from "./table-model"
import { TablePagination } from "./table-pagination"
import { saasTableFeatures } from "./table-features"
import { TableToolbar } from "./table-toolbar"
import type { IdentifiableRecord, SaasColumnMeta, SaasDataTableProps } from "./types"

function getSaasMeta(meta: unknown) {
  return meta as SaasColumnMeta | undefined
}

function stickyClasses(sticky: "left" | "right" | undefined, header = false) {
  if (sticky === "left") {
    return cn(
      "sticky left-0 transition-colors",
      header ? "z-10 bg-[#232323]" : "z-[2] bg-[#1c1c1c] group-hover:bg-[#252525] group-focus:bg-[#252525] group-data-[state=selected]:bg-[#252525]",
      "after:pointer-events-none after:absolute after:top-0 after:right-[-12px] after:h-full after:w-3 after:bg-gradient-to-r after:from-black/18 after:to-transparent",
    )
  }

  if (sticky === "right") {
    return cn(
      "sticky right-0 transition-colors",
      header ? "z-10 bg-[#232323]" : "z-[2] bg-[#1c1c1c] group-hover:bg-[#252525] group-focus:bg-[#252525] group-data-[state=selected]:bg-[#252525]",
      "before:pointer-events-none before:absolute before:top-0 before:left-[-12px] before:h-full before:w-3 before:bg-gradient-to-l before:from-black/18 before:to-transparent",
    )
  }

  return undefined
}

function defaultExport<T extends IdentifiableRecord>(records: T[]) {
  const payload = JSON.stringify(records, null, 2)
  const blob = new Blob([payload], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `selected-records-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function SaasDataTable<T extends IdentifiableRecord>({
  columns,
  data,
  searchPlaceholder = "Search term or filter…",
  getSearchText,
  onRowClick,
  onDeleteSelected,
  onExportSelected,
  onCreate,
  createLabel = "New record",
  isLoading = false,
  emptyTitle = "No records found.",
  emptyDescription = "Try adjusting your search or create a new record.",
  initialPageSize = 8,
  initialColumnVisibility = {},
  className,
}: SaasDataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>(initialColumnVisibility)
  const lastSelectedId = React.useRef<string | null>(null)
  const shiftClick = React.useRef(false)

  function handleSearchChange(value: string) {
    setGlobalFilter(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  const table = useTable({
    features: saasTableFeatures,
    data,
    columns,
    state: { globalFilter, sorting, rowSelection, columnVisibility, pagination },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue)
      const searchable = getSearchText?.(row.original)
      if (searchable) {
        return searchable.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      }
      return recordMatchesQuery(row.original, query)
    },
  })
  const selectedRecords = table.getSelectedRowModel().rows.map((row) => row.original)
  const pageRows = table.getRowModel().rows
  const pageRowIds = pageRows.map((row) => row.id)
  const visibleColumns = table.getVisibleLeafColumns()

  function handleHeaderSort(columnId: string) {
    setSorting((current) => getPocketBaseSort(current, columnId))
  }

  function handleRowSelection(rowId: string, checked: boolean) {
    setRowSelection((current) => {
      if (shiftClick.current && lastSelectedId.current) {
        return togglePocketBaseSelection(
          selectPocketBaseRange(current, pageRowIds, lastSelectedId.current, rowId, checked),
          rowId,
          checked,
        )
      }

      return togglePocketBaseSelection(current, rowId, checked)
    })
    lastSelectedId.current = rowId
    shiftClick.current = false
  }

  function handleExport() {
    if (onExportSelected) {
      onExportSelected(selectedRecords)
      return
    }

    defaultExport(selectedRecords)
  }

  function handleDelete() {
    if (!onDeleteSelected) return

    onDeleteSelected(selectedRecords)
    setRowSelection({})
    lastSelectedId.current = null
  }

  return (
    <section className={cn("flex min-h-0 flex-col", className)}>
      <TableToolbar
        onSearchChange={handleSearchChange}
        placeholder={searchPlaceholder}
        search={globalFilter}
        table={table}
      />
      <div className="min-h-0 overflow-auto bg-[#1c1c1c] [scrollbar-color:#4a4a4a_transparent]">
        <Table className="min-w-[970px] border-separate border-spacing-0 text-sm">
          <TableHeader className="sticky top-0 z-[4] [&_tr]:border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                <TableHead
                  className={cn(
                    "w-[62px] min-w-[62px] border-b border-white/8 pl-[30px] pr-[5px] text-white/45",
                    stickyClasses("left", true),
                  )}
                >
                  <Checkbox
                    aria-label="Select all records on this page"
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                    onClick={(event) => event.stopPropagation()}
                  />
                </TableHead>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return null
                  const meta = getSaasMeta(header.column.columnDef.meta)
                  const canSort = meta?.sortable !== false && header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <TableHead
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
                      className={cn(
                        "group/head h-[45px] border-b border-white/8 px-4 text-xs font-semibold text-white/50",
                        canSort && "cursor-pointer select-none hover:bg-white/[0.04] hover:text-white/80",
                        stickyClasses(meta?.sticky, true),
                        meta?.className,
                      )}
                      key={header.id}
                      onClick={() => canSort && handleHeaderSort(header.column.id)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {meta?.icon}
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort ? (
                          sorted === "desc" ? (
                            <ArrowDown className="size-3.5 text-white/65" />
                          ) : sorted === "asc" ? (
                            <ArrowUp className="size-3.5 text-white/65" />
                          ) : (
                            <ArrowUpDown className="size-3.5 text-white/30 opacity-0 transition-opacity duration-150 group-hover/head:opacity-100" />
                          )
                        ) : null}
                      </span>
                    </TableHead>
                  )
                })}
                <TableHead
                  className={cn(
                    "w-[75px] min-w-[75px] border-b border-white/8 px-4 text-right text-white/40",
                    stickyClasses("right", true),
                  )}
                >
                  <span className="sr-only">Open record</span>
                  <EllipsisVertical aria-hidden="true" className="ml-auto size-4" />
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody aria-busy={isLoading || undefined}>
            {isLoading ? (
              Array.from({ length: 6 }, (_, rowIndex) => (
                <TableRow className="border-white/8" key={`skeleton-row-${rowIndex}`}>
                  <TableCell
                    className={cn("h-[59px] pl-[30px] pr-[5px]", stickyClasses("left"))}
                  >
                    {rowIndex === 0 ? <span className="sr-only">Loading records…</span> : null}
                    <Skeleton className="size-4 rounded-[4px]" />
                  </TableCell>
                    {visibleColumns.map((column) => (
                      <TableCell
                        className={cn(
                          "h-[59px] px-4",
                          getSaasMeta(column.columnDef.meta)?.className,
                        )}
                        key={`skeleton-${column.id}`}
                      >
                        <Skeleton className="h-4 w-3/5 max-w-[180px] rounded-md" />
                      </TableCell>
                    ))}
                    <TableCell className={cn("h-[59px] px-4", stickyClasses("right"))} />
                  </TableRow>
                ))
            ) : pageRows.length ? (
              pageRows.map((row) => (
                <TableRow
                  aria-selected={row.getIsSelected()}
                  className="group cursor-pointer border-white/8 bg-[#1c1c1c] text-white/80 transition-colors duration-100 hover:bg-[#252525] focus-visible:bg-[#252525] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#5a9bff] data-[state=selected]:bg-[#252525]"
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  key={row.id}
                  onKeyDown={(event) => {
                    if ((event.target as HTMLElement).closest("[data-row-selection]")) return
                    if ((event.key === "Enter" || event.key === " ") && onRowClick) {
                      event.preventDefault()
                      onRowClick(row.original)
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  <TableCell className={cn("w-[62px] min-w-[62px] pl-[30px] pr-[5px]", stickyClasses("left"))}>
                    <Checkbox
                      aria-label={`Select ${row.original.id}`}
                      checked={row.getIsSelected()}
                      data-row-selection="true"
                      onCheckedChange={(checked) => handleRowSelection(row.id, !!checked)}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      onMouseDown={(event) => event.stopPropagation()}
                      onPointerDown={(event) => {
                        shiftClick.current = event.shiftKey
                      }}
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => {
                    const meta = getSaasMeta(cell.column.columnDef.meta)
                    return (
                      <TableCell
                        className={cn(
                          "h-[59px] px-4 text-[13px] text-white/78",
                          stickyClasses(meta?.sticky),
                          meta?.className,
                        )}
                        key={cell.id}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                  <TableCell
                    className={cn(
                      "w-[75px] min-w-[75px] px-4 text-right text-white/35",
                      stickyClasses("right"),
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    <ChevronRight className="ml-auto size-4 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white/80" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-52 px-6 text-center" colSpan={visibleColumns.length + 2}>
                  <div className="mx-auto max-w-sm">
                    <Database aria-hidden="true" className="mx-auto size-10 text-white/20" />
                    <p className="mt-4 font-medium text-white/80">{emptyTitle}</p>
                    <p className="mt-1 text-sm text-white/40">{emptyDescription}</p>
                    {onCreate ? (
                      <Button className="mt-4" onClick={onCreate} type="button">
                        {createLabel}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedRecords.length ? (
          <BulkActionBar
            count={selectedRecords.length}
            onDelete={onDeleteSelected ? handleDelete : undefined}
            onExport={handleExport}
            onReset={() => setRowSelection({})}
          />
        ) : null}
      </div>
      <TablePagination currentPage={pagination.pageIndex + 1} table={table} />
    </section>
  )
}
