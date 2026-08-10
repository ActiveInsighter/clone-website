# Multi-site Clone Boundaries Design

## Goal

Organize multiple website clones behind explicit site boundaries without changing the current visual output, interactions, or existing URLs.

## Navigation boundaries

The repository has three intentionally different navigation systems and they must remain separate:

1. `src/components/navigation/responsive-navigation.tsx` is the shared marketing-site top navigation primitive. OpenAI-specific menu data and rendering remain site-owned.
2. `src/components/sidebar/` is the compound sidebar primitive used by the ChatGPT clone. It owns ChatGPT-style desktop/mobile sidebar behavior and keyboard/focus contracts.
3. `src/components/ui/sidebar.tsx` is the shadcn sidebar primitive used by the Studio `AppShell`. It must not be replaced by the ChatGPT compound sidebar.

`src/components/app-shell/` remains the Studio-specific application shell. It is not promoted to a cross-site navigation component.

## Architecture

Add a `src/sites/` layer with one entry module per clone and a pure metadata manifest. The manifest is safe to import in tests; the registry maps the manifest to the existing React entry components. Add an explicit `/clones/[siteId]/[[...path]]` route for the new site catalog while leaving the legacy root, `/sidebar-demo`, and catch-all routes intact.

The first migration is intentionally additive: existing component files and their CSS imports remain in place, while new site entrypoints provide a stable ownership boundary. Later visual refactors can move implementation files behind those entrypoints without changing consumers.

## Testing

Pure tests verify the supported site IDs, route prefixes, and navigation surface ownership. The route is verified through typecheck/build, while existing sidebar behavior tests continue to protect the two sidebar implementations. No site-specific visual or interaction logic is changed in this phase.

## Non-goals

- No CSS rewrite or visual token changes.
- No navigation component merger.
- No removal of the legacy catch-all route.
- No dependency or framework change.
