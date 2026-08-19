# PocketBaseRecordSheet Specification

## Overview

- **Target file:** `src/components/pocketbase-record-sheet.tsx`
- **Interaction model:** click-driven right-side sheet with independently scrolling form content.
- **Reference behavior:** PocketBase `recordUpsertModal.js` and `modal.css`.

## Structure

```text
Sheet (right, 620px)
├── SheetHeader: Edit aw_messages record + overflow menu
├── scrollable content
│   ├── read-only id field
│   └── relation picker cards for owner/task/event/act
└── pinned footer: Close + Save changes
```

## Visual values

- Panel is `#1c1c1c` over a black translucent overlay.
- Form cards are `#2b2b2b` with a 10px radius and 1px low-contrast divider.
- Header and footer stay fixed while content scrolls.
- Desktop width is 620px; mobile width is 100%. Use the same
  `data-[side=right]` modifier as the shared Sheet primitive so Tailwind Merge
  replaces its default 75% width instead of leaving the defaults in effect.

## Behaviors

- The active record is independent from bulk selection.
- Closing the sheet clears the active record; Save changes emits a lightweight demo toast/status.
- Relation picker buttons open a small inline selection popover and update the field chip.
