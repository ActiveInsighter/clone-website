# PocketBase Collections Page Topology

1. **Blue application header**
   - Fixed-height navigation strip with PocketBase mark, Collections/Logs/Settings tabs, theme toggle, and account menu.
2. **Two-column workspace**
   - Left collection sidebar is fixed-width and scrollable.
   - Right content surface fills the remaining viewport.
3. **Collection page header**
   - Breadcrumbs (`Collections / aw_messages`), collection settings and refresh controls on the left.
   - API preview and New record actions on the right.
4. **Records toolbar**
   - Full-width pill search input with search affordance and filter placeholder.
5. **Records table viewport**
   - Sticky header, horizontally scrollable field columns, sticky bulk-select column on the left, and sticky row-open affordance on the right.
   - Row click opens the active record; checkbox click only changes bulk selection.
6. **Sticky bulk action bar**
   - Appears only while rows are selected and remains anchored near the bottom of the table workspace.
7. **Workspace footer**
   - Total count on the left and docs/version links on the right.
8. **Record detail sheet**
   - Right-side overlay with header, independently scrolling form body, and pinned footer actions.

The page is intentionally a compact dark admin surface. The mobile adaptation keeps the same hierarchy, hides the desktop collection rail behind a menu button, and lets the table scroll horizontally while the detail sheet becomes full width.
