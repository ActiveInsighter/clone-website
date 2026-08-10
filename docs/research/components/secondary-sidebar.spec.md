# SecondarySidebar Specification

## Overview

- **Target file:** `src/components/app-shell/secondary-sidebar.tsx`
- **Interaction model:** click-driven links with URL-derived active state; independent scrolling.

## Structure

- Header: title, optional description, optional header slot.
- Content: `NavigationGroup[]` with optional group titles and separator-like spacing.
- Footer: optional React slot.

## Supabase-derived content model

- Database Management: Schema Visualizer, Tables, Functions, Triggers, Enumerated Types, Extensions, Indexes, Publications.
- Access Control: Policies, Roles.
- Configuration: Settings.
- Platform: Replication, Backups, Migrations.

## Layout values

- Default width: `256px`.
- Header: `54px` minimum height and bottom border.
- Body: `overflow-y-auto`, `min-h-0`, compact `36px` rows.
- Active row: weak semantic accent background and foreground; no heavy shadow.

## Routing

- Active state is true for exact href matches and descendant routes.
- `activePatterns` may override default matching for aggregate routes such as `/database`.
