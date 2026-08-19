"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Database,
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

import { DataTableBulkActions } from "./data-table-bulk-actions"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { dataTableFeatures } from "./table-features"
import {
  clampPagination,
  getLoadedSelectedRecords,
  getNextSorting,
  getSelectedRowIds,
  normalizeSearchQuery,
  resolveUpdater,
  selectRowRange,
  toggleRowSelection,
  valueMatchesQuery,
  type StateUpdater,
} from "./table-model"
import type {
  DataTableBulkAction,
  DataTableColumnMeta,
  DataTableProps,
  DataTableRecord,
} from "./types"

type ControllableStateOptions<T> = {
  controlled: T | undefined
  defaultValue: T
  onChange?: (value: T) => void
}

function useControllableState<T>({
  controlled,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled === undefined ? uncontrolled : controlled
  const valueRef = React.useRef(value)

  React.useEffect(() => {
    valueRef.current = value
  }, [value])

  const setValue = React.useCallback(
    (updater: StateUpdater<T>) => {
      const next = resolveUpdater(updater, valueRef.current)

      if (Object.is(next, valueRef.current)) return

      valueRef.current = next

      if (controlled === undefined) {
        setUncontrolled(next)
      }

      onChange?.(next)
    },
    [controlled, onChange],
  )

  return [value, setValue] as const
}

function columnMeta(meta: unknown) {
  return meta as DataTableColumnMeta | undefined
}

function stickyCellClasses(side: "left" | "right", header = false) {
  return cn(
    "sticky transition-colors",
    side === "left" ? "left-0" : "right-0",
    header
      ? "z-10 bg-muted"
      : "z-[2] bg-background group-hover:bg-accent group-focus-visible:bg-accent group-data-[state=selected]:bg-accent",
    side === "left"
      ? "after:pointer-events-none after:absolute after:top-0 after:right-[-12px] after:h-full after:w-3 after:bg-gradient-to-r after:from-border/60 after:to-transparent"
      : "before:pointer-events-none before:absolute before:top-0 before:left-[-12px] before:h-full before:w-3 before:bg-gradient-to-l before:from-border/60 before:to-transparent",
  )
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest(
      "button,a,input,textarea,select,[role='button'],[role='menuitem'],[data-row-interactive]",
    )
  )
}

export function DataTable<T extends DataTableRecord>({
  columns,
  data,
  getRowId: getRowIdProp,
  getRecordLabel,
  searchPlaceholder = "Search records…",
  showSearch = true,
  getSearchText,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  sorting: controlledSorting,
  onSortingChange,
  pagination: controlledPagination,
  onPaginationChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  initialPageSize = 25,
  initialColumnVisibility = {},
  pageSizeOptions,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  rowCount,
  enableRowSelection = true,
  showColumnVisibility = true,
  showPagination = true,
  showFirstLastButtons = false,
  onRowClick,
  renderRowActions,
  rowActionsHeaderIcon,
  toolbarActions,
  bulkActions = [],
  onBulkActionError,
  onCreate,
  createLabel = "New record",
  isLoading = false,
  loadingRowCount = 6,
  emptyTitle = "No records found.",
  emptyDescription = "Try adjusting your search or create a new record.",
  recordsLabel = "records",
  recordLabel = recordsLabel.replace(/s$/, ""),
  classNames,
  className,
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useControllableState({
    controlled: controlledGlobalFilter,
    defaultValue: "",
    onChange: onGlobalFilterChange,
  })
  const [sorting, setSorting] = useControllableState<SortingState>({
    controlled: controlledSorting,
    defaultValue: [],
    onChange: onSortingChange,
  })
  const [pagination, setPagination] = useControllableState<PaginationState>({
    controlled: controlledPagination,
    defaultValue: { pageIndex: 0, pageSize: initialPageSize },
    onChange: onPaginationChange,
  })
  const [rowSelection, setRowSelection] = useControllableState<RowSelectionState>({
    controlled: controlledRowSelection,
    defaultValue: {},
    onChange: onRowSelectionChange,
  })
  const [columnVisibility, setColumnVisibility] =
    useControllableState<ColumnVisibilityState>({
      controlled: controlledColumnVisibility,
      defaultValue: initialColumnVisibility,
      onChange: onColumnVisibilityChange,
    })

  const [pendingActionId, setPendingActionId] = React.useState<string | null>(null)
  const lastSelectedId = React.useRef<string | null>(null)
  const shiftPressed = React.useRef(false)

  const clearSelection = React.useCallback(() => {
    setRowSelection({})
    lastSelectedId.current = null
  }, [setRowSelection])

  const resetToFirstPage = React.useCallback(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    )
  }, [setPagination])

  const getRowId = React.useCallback(
    (record: T) => getRowIdProp?.(record) ?? record.id,
    [getRowIdProp],
  )

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
    },
    getRowId,
    enableRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    rowCount,
    globalFilterFn: (row, columnId, filterValue) => {
      const query = normalizeSearchQuery(String(filterValue ?? ""))
      if (!query) return true
      if (columnVisibility[columnId] === false) return false

      if (getSearchText) {
        return getSearchText(row.original)
          .toLocaleLowerCase()
          .includes(query)
      }

      return valueMatchesQuery(row.getValue(columnId), query)
    },
  })

  const resolvedPageCount = table.getPageCount()

  React.useEffect(() => {
    if (manualPagination || resolvedPageCount < 0) return

    if (pagination.pageIndex >= resolvedPageCount) {
      setPagination((current) => clampPagination(current, resolvedPageCount))
    }
  }, [manualPagination, pagination.pageIndex, resolvedPageCount, setPagination])

  const pageRows = table.getRowModel().rows
  const pageRowIds = pageRows.map((row) => row.id)
  const selectedRowIds = getSelectedRowIds(rowSelection)
  const selectedRecords = getLoadedSelectedRecords(data, rowSelection, getRowId)
  const visibleColumns = table.getVisibleLeafColumns()
  const hasActionColumn = !!onRowClick || !!renderRowActions
  const utilityColumnCount =
    (enableRowSelection ? 1 : 0) + (hasActionColumn ? 1 : 0)

  function handleSearchChange(value: string) {
    setGlobalFilter(value)
    resetToFirstPage()
  }

  function handleHeaderSort(columnId: string) {
    setSorting((current) => getNextSorting(current, columnId))
    resetToFirstPage()
  }

  function handleRowSelection(rowId: string, checked: boolean) {
    setRowSelection((current) => {
      if (shiftPressed.current && lastSelectedId.current) {
        return selectRowRange(
          current,
          pageRowIds,
          lastSelectedId.current,
          rowId,
          checked,
        )
      }

      return toggleRowSelection(current, rowId, checked)
    })

    lastSelectedId.current = rowId
    shiftPressed.current = false
  }

  async function runBulkAction(action: DataTableBulkAction<T>) {
    if (!selectedRowIds.length || pendingActionId) return

    setPendingActionId(action.id)
    try {
      await action.action(selectedRecords, {
        rowIds: selectedRowIds,
        clearSelection,
      })
      if (!action.keepSelection) clearSelection()
    } catch (error) {
      if (onBulkActionError) {
        onBulkActionError(error, action.id)
      } else {
        console.error("Data table bulk action failed", error)
      }
    } finally {
      setPendingActionId(null)
    }
  }

  return (
    <section
      className={cn(
        "flex h-full min-h-0 w-full flex-col text-foreground",
        classNames?.root,
        className,
      )}
    >
      <DataTableToolbar
        classNames={classNames}
        onSearchChange={handleSearchChange}
        placeholder={searchPlaceholder}
        search={globalFilter}
        showColumnVisibility={showColumnVisibility}
        showSearch={showSearch}
        table={table}
        toolbarActions={toolbarActions}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full min-h-0 overflow-auto bg-background">
          <Table
            className={cn(
              "min-w-full border-separate border-spacing-0 text-sm",
              classNames?.table,
            )}
            containerClassName="overflow-visible"
          >
          <TableHeader className="sticky top-0 z-[4] [&_tr]:border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {enableRowSelection ? (
                  <TableHead
                    className={cn(
                      "w-12 min-w-12 border-b border-border px-4 text-muted-foreground/90",
                      stickyCellClasses("left", true),
                      classNames?.selectionHeaderCell,
                    )}
                  >
                    <Checkbox
                      aria-label="Select all records on this page"
                      checked={table.getIsAllPageRowsSelected()}
                      indeterminate={table.getIsSomePageRowsSelected()}
                      onCheckedChange={(checked) =>
                        table.toggleAllPageRowsSelected(!!checked)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableHead>
                ) : null}

                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return null

                  const meta = columnMeta(header.column.columnDef.meta)
                  const canSort = meta?.sortable !== false && header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <TableHead
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : "none"
                      }
                      className={cn(
                        "group/head h-10 border-b border-border px-4 text-xs font-semibold text-muted-foreground",
                        canSort && "cursor-pointer select-none hover:bg-foreground/5 hover:text-foreground/80",
                        meta?.sticky && stickyCellClasses(meta.sticky, true),
                        meta?.widthClassName,
                        meta?.headerClassName,
                        classNames?.headerCell,
                      )}
                      key={header.id}
                    >
                      {canSort ? (
                        <button
                          className="flex w-full items-center gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          onClick={() => handleHeaderSort(header.column.id)}
                          type="button"
                        >
                          {meta?.icon}
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {sorted === "desc" ? (
                            <ArrowDown className="size-3.5 shrink-0 text-foreground/65" />
                          ) : sorted === "asc" ? (
                            <ArrowUp className="size-3.5 shrink-0 text-foreground/65" />
                          ) : (
                            <ArrowUpDown className="size-3.5 shrink-0 text-foreground/30 opacity-0 transition-opacity duration-150 group-hover/head:opacity-100" />
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          {meta?.icon}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                    </TableHead>
                  )
                })}

                {hasActionColumn ? (
                  <TableHead
                    className={cn(
                      "w-12 min-w-12 border-b border-border px-3 text-right text-muted-foreground/90",
                      stickyCellClasses("right", true),
                      classNames?.rowActionsHeaderCell,
                    )}
                  >
                    <span className="sr-only">Row actions</span>
                    {rowActionsHeaderIcon}
                  </TableHead>
                ) : null}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody aria-busy={isLoading || undefined}>
            {isLoading ? (
              Array.from({ length: loadingRowCount }, (_, rowIndex) => (
                <TableRow className="border-border" key={`skeleton-row-${rowIndex}`}>
                  {enableRowSelection ? (
                    <TableCell
                      className={cn(
                        "h-12 w-12 min-w-12 px-4",
                        stickyCellClasses("left"),
                        classNames?.selectionCell,
                      )}
                    >
                      {rowIndex === 0 ? (
                        <span className="sr-only">Loading records…</span>
                      ) : null}
                      <Skeleton className="size-4 rounded-[4px]" />
                    </TableCell>
                  ) : null}

                  {visibleColumns.map((column) => (
                    <TableCell
                      className={cn(
                        "h-12 px-4",
                        columnMeta(column.columnDef.meta)?.widthClassName,
                        columnMeta(column.columnDef.meta)?.cellClassName,
                        classNames?.cell,
                      )}
                      key={`skeleton-${column.id}`}
                    >
                      <Skeleton className="h-4 w-3/5 max-w-[180px] rounded-md" />
                    </TableCell>
                  ))}

                  {hasActionColumn ? (
                    <TableCell
                      className={cn(
                        "h-12 w-12 min-w-12 px-3",
                        stickyCellClasses("right"),
                        classNames?.rowActionsCell,
                      )}
                    />
                  ) : null}
                </TableRow>
              ))
            ) : pageRows.length ? (
              pageRows.map((row) => (
                <TableRow
                  aria-selected={row.getIsSelected()}
                  className={cn(
                    "group border-b border-border bg-background text-foreground/80 transition-colors duration-100 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring data-[state=selected]:bg-accent",
                    onRowClick && "cursor-pointer",
                    classNames?.row,
                  )}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  key={row.id}
                  onClick={(event) => {
                    if (!onRowClick || isInteractiveTarget(event.target)) return
                    onRowClick(row.original)
                  }}
                  onKeyDown={(event) => {
                    if (!onRowClick || event.target !== event.currentTarget) return
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onRowClick(row.original)
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {enableRowSelection ? (
                    <TableCell
                      className={cn(
                        "h-12 w-12 min-w-12 px-4",
                        stickyCellClasses("left"),
                        classNames?.selectionCell,
                      )}
                    >
                      <Checkbox
                        aria-label={`Select ${
                          getRecordLabel?.(row.original) ?? row.original.id
                        }`}
                        checked={row.getIsSelected()}
                        data-row-interactive="true"
                        onCheckedChange={(checked) =>
                          handleRowSelection(row.id, !!checked)
                        }
                        onPointerDown={(event) => {
                          shiftPressed.current = event.shiftKey
                        }}
                      />
                    </TableCell>
                  ) : null}

                  {row.getVisibleCells().map((cell) => {
                    const meta = columnMeta(cell.column.columnDef.meta)
                    return (
                      <TableCell
                        className={cn(
                          "h-12 px-4 text-sm text-foreground/80",
                          meta?.sticky && stickyCellClasses(meta.sticky),
                          meta?.widthClassName,
                          meta?.cellClassName,
                          classNames?.cell,
                        )}
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}

                  {hasActionColumn ? (
                    <TableCell
                      className={cn(
                        "h-12 w-12 min-w-12 px-3 text-right text-foreground/35",
                        stickyCellClasses("right"),
                        classNames?.rowActionsCell,
                      )}
                    >
                      {renderRowActions ? (
                        <div data-row-interactive="true">
                          {renderRowActions(row.original)}
                        </div>
                      ) : (
                        <ChevronRight
                          aria-hidden="true"
                          className="ml-auto size-4 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-foreground/80"
                        />
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-52 px-6 text-center"
                  colSpan={Math.max(visibleColumns.length + utilityColumnCount, 1)}
                >
                  <div className="mx-auto max-w-sm">
                    <Database
                      aria-hidden="true"
                      className="mx-auto size-10 text-muted-foreground/40"
                    />
                    <p className="mt-4 font-medium text-foreground/80">
                      {emptyTitle}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground/80">
                      {emptyDescription}
                    </p>
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
        </div>

        {enableRowSelection && selectedRowIds.length ? (
          <DataTableBulkActions
            actions={bulkActions}
            className={classNames?.bulkBar}
            count={selectedRowIds.length}
            onReset={clearSelection}
            onRunAction={runBulkAction}
            pendingActionId={pendingActionId}
            recordLabel={recordLabel}
            recordsLabel={recordsLabel}
          />
        ) : null}
      </div>

      {showPagination ? (
        <DataTablePagination
          classNames={classNames}
          pageSizeOptions={pageSizeOptions}
          pagination={pagination}
          recordsLabel={recordsLabel}
          showFirstLastButtons={showFirstLastButtons}
          table={table}
        />
      ) : null}
    </section>
  )
}
