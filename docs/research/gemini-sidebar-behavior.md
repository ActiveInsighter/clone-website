# Gemini Sidebar Behavior Notes

## Interaction model

The sidebar is primarily click-driven. The page does not require an API-backed chat history for the requested clone: the visible recent conversations are static data, while the controls update local active state and announce the selected label.

1. The collapsed rail opens the panel with the top sidebar toggle.
2. The expanded panel closes through the same toggle in the header.
3. `笔记本` and `最近` are independent disclosure sections.
4. The middle region scrolls independently from the fixed footer.
5. On mobile, the same configuration is rendered in the shared dialog drawer primitive.
6. The page body stays static and focuses on the Gemini zero-state composer.

## Responsive evidence

The live desktop capture exposes both full and compact states in the same page: full width is `288px`, compact width is `52px`. The local component also inherits the reusable sidebar's `48rem` mobile breakpoint, which renders the panel as a drawer and prevents the narrow rail from competing with the content.

## Deliberate clone boundary

Authentication, account menus, search results, notebook creation, settings screens, and Gemini responses remain non-networked demo interactions. The visible labels and recent titles are real captured content; their local links are stable clone routes for navigation affordances.
