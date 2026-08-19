# DataTable Specification

## Overview

- **Generic package:** `src/components/data-table/` — backend- and theme-agnostic.
- **Domain layer:** `src/components/pocketbase-table/` — PocketBase columns, cells, and mock data.
- **Skin:** `.pocketbase-table-skin` token scope in `src/app/globals.css`.
- **Interaction model:** click-driven with controlled-or-uncontrolled search, sort, column visibility, selection, pagination, keyboard row activation, and a floating bulk action bar.
- **Reference behavior:** PocketBase `recordsList.js` and `table.css`.

## Architecture

```text
features (PocketBase page, columns, cells, sheet)
        ↓
DataTable            sort/filter/select/page/columns, manual* server modes
        ↓
UI primitives        shadcn / Tailwind / theme tokens
```

```text
DataTable
├── DataTableToolbar
│   ├── global search input
│   ├── toolbarActions slot
│   └── column visibility menu (portaled into the toolbar so skins apply)
├── horizontally scrollable Table
│   ├── sticky selection column
│   ├── sortable data columns (meta.widthClassName, meta.sticky, meta.icon)
│   └── sticky row-actions column (renderRowActions or default chevron)
├── DataTableBulkActions (config-driven, only when selected > 0)
└── DataTablePagination (rowCount-aware, optional page-size select)
```

## Public API essentials

```tsx
<DataTable
  columns={columns}
  data={data}
  rowCount={total}
  sorting={sorting}
  onSortingChange={setSorting}
  pagination={pagination}
  onPaginationChange={setPagination}
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
  manualPagination
  manualSorting
  manualFiltering
  isLoading={isLoading}
  onRowClick={openRecord}
  renderRowActions={...}
  toolbarActions={...}
  bulkActions={[...]}
  classNames={{...}}
/>
```

- All table state (`sorting`, `pagination`, `rowSelection`, `columnVisibility`, `globalFilter`) supports both uncontrolled and controlled usage via `useControllableState`.
- Server-side mode: pass `manualPagination`/`manualSorting`/`manualFiltering` plus `rowCount`/`pageCount`; `data` holds only the loaded page. The table never learns which backend produced the rows.
- Bulk actions are declarative: `{ id, label, icon, destructive?, keepSelection?, action: async }`. Actions receive loaded record objects plus a context containing every selected row ID, so manual-pagination consumers can mutate unloaded selections. Selection clears after success and errors surface through `onBulkActionError`.
- Colors come exclusively from shadcn theme tokens; consumers re-scope the tokens (`.pocketbase-table-skin`) instead of editing the component. Structural sizing overrides ride on the `classNames` slots.

## Required behaviors

- Header checkbox selects or clears all rows in the current filtered page.
- Row checkbox toggles only selection and must not activate the row.
- Shift-click selects the inclusive range between the last selected row and the clicked row.
- Clicking a regular row area, or pressing Enter/Space while the row is focused, calls `onRowClick`; interactive descendants (`button`, `a`, inputs, `[data-row-interactive]`) are excluded.
- Sorting starts descending, then toggles ascending/descending; sorting and searching reset to the first page.
- Client-side search matches visible column values case-insensitively; hidden columns never match. `getSearchText` overrides the projection.
- Column visibility is exposed through a dropdown menu portaled into the toolbar so themed skins style it.
- Bulk bar exposes Reset plus every configured action; it is an absolutely positioned overlay, never a sticky layout participant.
- Loading, empty, and no-results states are explicit.
- Client mode clamps `pageIndex` back into range when data shrinks.

## Visual values (PocketBase skin)

- Row surface `#1c1c1c`; header `#232323`; hover/selected `#252525`; toolbar inputs and menus `#292929`; bulk pill `#202020/95`.
- Focus ring `#5a9bff`; borders `rgb(255 255 255 / 8%)`; interactive borders `rgb(255 255 255 / 12%)`.
- Body row height 59px; header height 45px; the full PocketBase field table is about 3530px wide; selection (62px) and actions (75px) columns are sticky with edge gradients.
- Bulk bar is a rounded pill with soft border and shadow, centered near the bottom of the table viewport.

## Responsive behavior

- **1440px:** the shell uses a 240px left rail; the table is intentionally wider than the content viewport and scrolls horizontally.
- **1024px:** the 240px collection rail remains visible; only the table viewport narrows.
- **768px:** the collection rail is hidden and there is no document-level horizontal overflow.
- **320px:** page shell stays within the viewport; the wide field table scrolls only inside its own container, and collection names truncate before utility buttons.
- **390px:** mobile toolbar and table utility columns remain usable; the PocketBase record sheet fills the viewport width.
