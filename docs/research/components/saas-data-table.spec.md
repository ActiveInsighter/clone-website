# SaasDataTable Specification

## Overview

- **Target file:** `src/components/pocketbase-table/saas-data-table.tsx`
- **Interaction model:** click-driven with controlled search, sort, column visibility, selection, pagination, keyboard row activation, and a sticky bulk action bar.
- **Reference behavior:** PocketBase `recordsList.js` and `table.css`.

## Structure

```text
SaasDataTable
├── TableToolbar
│   ├── global search input
│   └── column visibility menu
├── horizontally scrollable Table
│   ├── sticky selection column
│   ├── sortable data columns
│   └── sticky row action column
├── BulkActionBar (only when selected > 0)
└── TablePagination
```

## Required behaviors

- Header checkbox selects or clears all rows in the current filtered page.
- Row checkbox toggles only selection and must stop row activation.
- Shift-click selects the inclusive range between the last selected row and the clicked row.
- Clicking a regular row cell, or pressing Enter/Space while the row is focused, calls `onRowClick`.
- Sorting starts descending, then toggles ascending/descending on the same header.
- Search matches all visible row values case-insensitively.
- Column visibility is persisted only in component state for the demo and is exposed through a dropdown menu.
- Bulk bar exposes Reset, Delete, and JSON export callbacks.
- Loading, empty, and no-results states are explicit.

## Visual values

- Dark surface: `#191919`; panel: `#202020`; input/header surface: `#292929`.
- Primary accent: PocketBase blue `#2f6fed`; selection accent: emerald `#16a66f`.
- Body row height: 59px; the full PocketBase field table is about 3530px wide; left and right utility columns are sticky.
- Table borders are subtle 1px separators; selected rows use a slightly brighter surface.
- Bulk bar is a rounded pill with soft border and shadow, centered near the bottom of the workspace.

## Responsive behavior

- **1440px:** the shell uses a 240px left rail; the table is intentionally wider than the content viewport and scrolls horizontally.
- **768px:** left rail remains visible but narrows; header action labels collapse.
- **390px:** collection rail is hidden, the table keeps a minimum width and scrolls horizontally, and the sheet is full width.
