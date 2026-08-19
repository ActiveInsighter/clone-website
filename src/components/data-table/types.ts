import type {
  ColumnDef,
  ColumnVisibilityState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
} from "@tanstack/react-table"
import type { ReactNode } from "react"

import type { DataTableFeatures } from "./table-features"

export type DataTableRecord = {
  id: string
}

export type DataTableColumnMeta = {
  /** Human-readable label used by the column visibility menu. */
  label?: string
  /** Optional visual icon rendered before the header content. */
  icon?: ReactNode
  /** Tailwind width utilities shared by header, loading, and body cells. */
  widthClassName?: string
  /** Pins the column to the horizontal edge of the scroll container. */
  sticky?: "left" | "right"
  /** Set to `false` to opt a column out of header sort clicks. */
  sortable?: boolean
  /** Header-only styling hook. */
  headerClassName?: string
  /** Body-cell-only styling hook. */
  cellClassName?: string
}

export type DataTableColumnDef<T extends DataTableRecord> = ColumnDef<
  DataTableFeatures,
  T,
  unknown
> & {
  meta?: DataTableColumnMeta
}

/**
 * Declarative bulk action consumed by the floating bulk action bar. Actions
 * run asynchronously; selection is cleared automatically after success unless
 * `keepSelection` is set.
 */
export type DataTableBulkAction<T extends DataTableRecord> = {
  id: string
  label: string
  icon?: ReactNode
  destructive?: boolean
  disabled?: boolean
  keepSelection?: boolean
  action: (
    records: T[],
    context: DataTableBulkActionContext,
  ) => void | Promise<void>
}

export type DataTableBulkActionContext = {
  /** Every selected id, including selections from unloaded server pages. */
  rowIds: string[]
  clearSelection: () => void
}

/**
 * Fine-grained class slots. The DataTable consumes only shadcn theme tokens
 * for color, so consumers customize the look by re-scoping those tokens and
 * by overriding structural details here.
 */
export type DataTableClassNames = {
  /** Root section wrapper. */
  root?: string
  /** Toolbar container. */
  toolbar?: string
  /** Search input inside the toolbar. */
  searchInput?: string
  /** Column visibility dropdown content. */
  columnsMenu?: string
  /** The `<table>` element. */
  table?: string
  /** Every data header cell. */
  headerCell?: string
  /** Sticky selection header cell. */
  selectionHeaderCell?: string
  /** Sticky selection body cell. */
  selectionCell?: string
  /** Sticky row-actions header cell. */
  rowActionsHeaderCell?: string
  /** Sticky row-actions body cell. */
  rowActionsCell?: string
  /** Every data body cell. */
  cell?: string
  /** Every body row. */
  row?: string
  /** Footer pagination bar. */
  pagination?: string
  /** Floating bulk action bar wrapper. */
  bulkBar?: string
}

export type DataTableProps<T extends DataTableRecord> = {
  columns: DataTableColumnDef<T>[]
  data: T[]

  /** Override when a record's stable key should be derived from another field. */
  getRowId?: (record: T) => string
  /** Optional record label for accessible selection announcements. */
  getRecordLabel?: (record: T) => string

  // Search
  searchPlaceholder?: string
  showSearch?: boolean
  /**
   * Record-level search projection. When omitted, client-side global
   * filtering evaluates each visible column value independently.
   */
  getSearchText?: (record: T) => string
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void

  // Controlled table state (omit for uncontrolled mode)
  sorting?: SortingState
  onSortingChange?: (value: SortingState) => void
  pagination?: PaginationState
  onPaginationChange?: (value: PaginationState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (value: RowSelectionState) => void
  columnVisibility?: ColumnVisibilityState
  onColumnVisibilityChange?: (value: ColumnVisibilityState) => void

  initialPageSize?: number
  initialColumnVisibility?: ColumnVisibilityState
  pageSizeOptions?: number[]

  // Server-side modes; `data` should contain only the currently loaded rows
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  pageCount?: number
  rowCount?: number

  // Feature switches
  enableRowSelection?: boolean
  showColumnVisibility?: boolean
  showPagination?: boolean
  showFirstLastButtons?: boolean

  // Row interactions
  onRowClick?: (record: T) => void
  /** Replaces the default trailing chevron in the actions column. */
  renderRowActions?: (record: T) => ReactNode
  /** Replaces the ellipsis icon in the actions header cell. */
  rowActionsHeaderIcon?: ReactNode
  /** Extra toolbar content rendered between search and the columns menu. */
  toolbarActions?: ReactNode

  // Bulk actions
  bulkActions?: DataTableBulkAction<T>[]
  onBulkActionError?: (error: unknown, actionId: string) => void

  // Empty / loading states
  onCreate?: () => void
  createLabel?: string
  isLoading?: boolean
  loadingRowCount?: number
  emptyTitle?: string
  emptyDescription?: string
  /** Noun used in the pagination and bulk bar counters. */
  recordsLabel?: string
  /** Singular form used in the bulk bar counter; defaults to `recordsLabel` minus a trailing "s". */
  recordLabel?: string

  classNames?: DataTableClassNames
  className?: string
}

export type DataTableInstance<T extends DataTableRecord> = Table<
  DataTableFeatures,
  T
>
