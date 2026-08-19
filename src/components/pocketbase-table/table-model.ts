import type { RowSelectionState, SortingState } from "@tanstack/react-table"

export function recordMatchesQuery(
  record: Record<string, unknown>,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  if (!normalizedQuery) return true

  return Object.values(record).some((value) =>
    String(value ?? "").toLocaleLowerCase().includes(normalizedQuery),
  )
}

export function filterPocketBaseRecords<T extends Record<string, unknown>>(
  records: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  if (!normalizedQuery) return [...records]

  return records.filter((record) => recordMatchesQuery(record, normalizedQuery))
}

export function getPocketBaseSort(
  sorting: SortingState,
  columnId: string,
): SortingState {
  const current = sorting.find((sort) => sort.id === columnId)

  return [{ id: columnId, desc: current ? !current.desc : true }]
}

export function togglePocketBaseSelection(
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

export function selectPocketBaseRange(
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
