import type { ColumnDef, ColumnVisibilityState, Table } from "@tanstack/react-table"
import type { ReactNode } from "react"
import type { SaasTableFeatures } from "./table-features"

export type IdentifiableRecord = {
  id: string
}

export type SaasColumnMeta = {
  label?: string
  sticky?: "left" | "right"
  sortable?: boolean
  width?: string
  className?: string
  icon?: ReactNode
}

export type SaasColumnDef<T extends IdentifiableRecord> = ColumnDef<SaasTableFeatures, T, unknown> & {
  meta?: SaasColumnMeta
}

export type SaasDataTableProps<T extends IdentifiableRecord> = {
  columns: SaasColumnDef<T>[]
  data: T[]
  searchPlaceholder?: string
  getSearchText?: (record: T) => string
  onRowClick?: (record: T) => void
  onDeleteSelected?: (records: T[]) => void
  onExportSelected?: (records: T[]) => void
  onCreate?: () => void
  createLabel?: string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  initialPageSize?: number
  initialColumnVisibility?: ColumnVisibilityState
  className?: string
}

export type TableToolbarProps<T extends IdentifiableRecord> = {
  table: Table<SaasTableFeatures, T>
  search: string
  onSearchChange: (value: string) => void
  placeholder: string
}
