import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table"

export type StateUpdater<T> = T | ((previous: T) => T)

export function resolveUpdater<T>(
  updater: StateUpdater<T>,
  previous: T,
): T {
  return typeof updater === "function"
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase()
}

export function valueMatchesQuery(value: unknown, query: string): boolean {
  const normalizedQuery = normalizeSearchQuery(query)
  if (!normalizedQuery) return true

  return String(value ?? "")
    .toLocaleLowerCase()
    .includes(normalizedQuery)
}

/**
 * Database-style single-column sorting: the first click sorts descending,
 * subsequent clicks toggle direction. This matches common admin/SaaS data
 * browsers where the newest/largest values are the useful first view.
 */
export function getNextSorting(
  sorting: SortingState,
  columnId: string,
  descendingFirst = true,
): SortingState {
  const current = sorting.find((sort) => sort.id === columnId)

  if (!current) {
    return [{ id: columnId, desc: descendingFirst }]
  }

  return [{ id: columnId, desc: !current.desc }]
}

export function toggleRowSelection(
  selection: RowSelectionState,
  rowId: string,
  checked: boolean,
): RowSelectionState {
  const next = { ...selection }

  if (checked) {
    next[rowId] = true
  } else {
    delete next[rowId]
  }

  return next
}

/**
 * Returns every positively selected row id, including ids whose records are
 * not part of the currently loaded manual-pagination page.
 */
export function getSelectedRowIds(
  selection: RowSelectionState,
): string[] {
  return Object.entries(selection)
    .filter(([, selected]) => selected)
    .map(([rowId]) => rowId)
}

/**
 * Projects the selected records that are available in the current data set.
 * Server-driven tables can combine this with `getSelectedRowIds` when their
 * controlled selection spans pages that are not loaded in the browser.
 */
export function getLoadedSelectedRecords<T>(
  records: readonly T[],
  selection: RowSelectionState,
  getRowId: (record: T) => string,
): T[] {
  return records.filter((record) => selection[getRowId(record)] === true)
}

export function selectRowRange(
  selection: RowSelectionState,
  rowIds: readonly string[],
  fromId: string,
  toId: string,
  checked: boolean,
): RowSelectionState {
  const fromIndex = rowIds.indexOf(fromId)
  const toIndex = rowIds.indexOf(toId)

  if (fromIndex === -1 || toIndex === -1) return { ...selection }

  const start = Math.min(fromIndex, toIndex)
  const end = Math.max(fromIndex, toIndex)
  const next = { ...selection }

  for (const rowId of rowIds.slice(start, end + 1)) {
    if (checked) {
      next[rowId] = true
    } else {
      delete next[rowId]
    }
  }

  return next
}

export function clampPagination(
  pagination: PaginationState,
  pageCount: number,
): PaginationState {
  const maxPageIndex = Math.max(pageCount - 1, 0)

  if (pagination.pageIndex <= maxPageIndex) return pagination

  return {
    ...pagination,
    pageIndex: maxPageIndex,
  }
}

/**
 * Serializes records and triggers a JSON download. Generic bulk "export"
 * fallback that feature layers can reuse inside their own bulk action config.
 */
export function downloadRecordsJson<T>(
  records: readonly T[],
  filenamePrefix = "records",
): void {
  const payload = JSON.stringify(records, null, 2)
  const blob = new Blob([payload], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = `${filenamePrefix}-${new Date()
    .toISOString()
    .slice(0, 10)}.json`
  anchor.hidden = true
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
