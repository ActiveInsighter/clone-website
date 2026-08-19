# PocketBase Collections Behaviors

## Evidence

- Target: `https://pb.any1.tech/_/#/collections?collection=aw_messages&sort=owner`
- Live page inspected through the authenticated Chrome tab at 1441px viewport.
- Official source checked from the PocketBase repository: `ui/src/records/recordsList.js`, `ui/src/collections/pageCollections.js`, `ui/src/css/table.css`, `ui/src/css/modal.css`, and `ui/src/collections/collectionsSidebar.js`.

## Interaction model

- Collection navigation and record selection are click-driven.
- Search and sort are controlled state. PocketBase reflects them into hash query parameters.
- Checkbox selection is independent from the active record. Checkbox clicks stop row-click propagation.
- A row click or Enter/Space on a focused row opens the active record in a right-side drawer.
- Bulk selection reveals a sticky bottom action bar with Reset, Delete, and JSON export.
- Shift-click selection selects an inclusive range.
- The table header is sticky inside the horizontally scrollable table wrapper.

## Live measurements (Chrome, 1441px viewport)

- IBM Plex Sans, 14px body, 22px line-height; page background `rgb(28, 28, 28)`.
- Sidebar width: 240px; page content begins at x=240px.
- Table wrapper: x=240px, width about 1201px, height about 296px; the table itself is about 3530px wide.
- Header cells are 45px tall; body rows are 59px tall.
- Field widths: id 172px; relation fields 190px; nodeIndex 144px; attempt 126px; status 180px; long text/JSON fields 300px; sentAt 117px; receivedAt 144px; created 123px; updated 128px.
- Sticky utility columns: bulk select 62px on the left and row actions 75px on the right.
- Clicking a sortable header writes `sort=-<field>` into the hash; the next click reverses the direction.

## Source-grounded behaviors

- `recordsList.js` stores `bulkSelected` as a record-id keyed object and computes `totalSelected` from its keys.
- `recordsList.js` calls `props.onselect(record)` from the row click/keyboard handlers and calls `stopPropagation()` in the bulk-select cell.
- `table.css` gives `.col-bulk-select` `position: sticky; left: 0` and `.col-meta` `position: sticky; right: 0`.
- `table.css` gives table rows a 59px body height, a highlighted hover state, and a right-arrow affordance.
- `modal.css` uses a 620px right-side fixed modal, `transform: translateX(30px)` for the closed state, and an independently scrolling `.modal-content` between header and footer.
- `pageCollections.js` keeps `activeRecordIdOrModel` separate from filter/sort state and synchronizes the selected record with the `record` hash query key.

## Implemented demo parity

- Uses TanStack Table for filtering, sorting, column visibility, row selection, and pagination.
- Uses shadcn/base-ui primitives for Table, Checkbox, Button, DropdownMenu, and Sheet.
- Uses local fixture data only; no PocketBase authentication or network calls are required.
- Uses a 620px desktop detail sheet, with a full-width mobile sheet.
- Search matches all row values case-insensitively.
- Column visibility is component state and is exposed through a dropdown menu.
- Bulk bar exposes Reset, Delete, and JSON export callbacks.
- Loading, empty, and no-results states are explicit.

## Responsive behavior

- **1440px:** left rail is 240px; the table is intentionally much wider than the content viewport and scrolls horizontally.
- **768px:** the shell keeps the table min-width and collapses secondary header labels.
- **390px:** collection rail is hidden behind the menu button, the table scrolls horizontally, and the detail sheet is full width.
