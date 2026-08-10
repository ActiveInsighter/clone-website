# ChatGPT Sidebar Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the reusable sidebar primitives product-neutral and robust, then use them to reproduce the inspected ChatGPT sidebar interactions in the local example.

**Architecture:** Keep state, responsive layout, persistence, keyboard behavior, and compound slots in `src/components/chat-sidebar/`. Move ChatGPT-specific data and mutations into a pure reducer model, and render those mutations through a ChatGPT-only composition that consumes the generic aliases from `src/components/sidebar/`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Base UI-backed shadcn primitives, Lucide React, Node 26 `node:test` with TypeScript stripping.

## Global Constraints

- Preserve existing imports and public names exported by `src/components/sidebar/index.ts`.
- Do not put ChatGPT product copy, data, or ChatGPT-specific icons into the reusable sidebar implementation.
- Keep the demo local-only; no authentication, backend, or network mutations.
- Use 260px expanded width, 59px rail width, and 59px header height for the ChatGPT skin.
- Follow the repository’s strict TypeScript, 2-space, named-export, mobile-first conventions.
- Write each test before the production behavior it proves, run it failing, then implement the minimum behavior and run it passing.

---

### Task 1: Add pure sidebar helper tests and test command

**Files:**
- Create: `tests/chat-sidebar-state.test.ts`
- Create: `tests/chatgpt-sidebar-model.test.ts`
- Modify: `package.json` scripts

**Interfaces:**
- Tests will import `readSidebarCookieState`, `serializeSidebarCookie`, and `matchesSidebarShortcut` from `src/components/chat-sidebar/state.ts`.
- Tests will import `createChatGptSidebarState` and `chatGptSidebarReducer` from `src/components/chatgpt-sidebar-demo/model.ts`.

- [x] **Step 1: Write the failing generic helper tests**

Add tests for:

```ts
test("reads the configured boolean cookie and ignores other cookies", () => {
  assert.equal(
    readSidebarCookieState("theme=dark; chat_sidebar_state=false; x=1", "chat_sidebar_state"),
    false,
  )
  assert.equal(readSidebarCookieState("theme=dark", "chat_sidebar_state"), undefined)
})

test("matches the configured modifier shortcut case-insensitively", () => {
  assert.equal(matchesSidebarShortcut({ key: "B", ctrlKey: true, metaKey: false }, "b"), true)
  assert.equal(matchesSidebarShortcut({ key: "b", ctrlKey: false, metaKey: true }, "b"), true)
  assert.equal(matchesSidebarShortcut({ key: "b", ctrlKey: false, metaKey: false }, "b"), false)
})
```

Add a serialization assertion that produces `chat_sidebar_state=false; path=/; max-age=604800`.

- [x] **Step 2: Write the failing ChatGPT model tests**

Cover one behavior per test:

```ts
test("pinning a chat moves it into the pinned collection", () => {
  const state = createChatGptSidebarState()
  const chatId = state.chats[0].id
  const next = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId })
  assert.deepEqual(next.chats.filter((chat) => chat.pinned).map((chat) => chat.id), [chatId])
})

test("moving a chat changes its project without removing it from chat history", () => {
  const state = createChatGptSidebarState()
  const chatId = state.chats[0].id
  const projectId = state.projects[1].id
  const next = chatGptSidebarReducer(state, { type: "move-chat", chatId, projectId })
  assert.equal(next.chats.find((chat) => chat.id === chatId)?.projectId, projectId)
})

test("search filters visible chats and projects by title", () => {
  const state = chatGptSidebarReducer(createChatGptSidebarState(), { type: "set-search", query: "workflow" })
  assert.deepEqual(state.searchQuery, "workflow")
  assert.ok(state.projects.some((project) => project.name === "Anyworkflow"))
})

test("deleting a project also removes its project assignment from chats", () => {
  const state = createChatGptSidebarState()
  const projectId = state.projects[0].id
  const next = chatGptSidebarReducer(state, { type: "delete-project", projectId })
  assert.equal(next.projects.some((project) => project.id === projectId), false)
  assert.equal(next.chats.some((chat) => chat.projectId === projectId), false)
})
```

- [x] **Step 3: Run the focused tests and verify the expected RED state**

Run:

```text
npm test -- --test-concurrency=1
```

Expected: the command fails because the helper and model modules do not exist yet. Fix only test syntax or import-path mistakes if the failure is unrelated.

- [x] **Step 4: Add the test script**

Set `package.json` to run `node --experimental-strip-types --test tests` through `npm test`, without adding a test dependency.

---

### Task 2: Implement pure helper and ChatGPT state model

**Files:**
- Create: `src/components/chat-sidebar/state.ts`
- Create: `src/components/chatgpt-sidebar-demo/model.ts`
- Modify: `tests/chat-sidebar-state.test.ts` only if a type-level assertion needs correction
- Modify: `tests/chatgpt-sidebar-model.test.ts` only if a test fixture needs correction

**Interfaces:**
- `readSidebarCookieState(cookieHeader: string, cookieName: string): boolean | undefined` returns only exact `true`/`false` cookie values.
- `serializeSidebarCookie(cookieName: string, open: boolean, maxAge: number): string` returns a browser-ready cookie assignment.
- `matchesSidebarShortcut(event: { key: string; ctrlKey: boolean; metaKey: boolean }, shortcut: string): boolean` matches a key with either Ctrl or Meta.
- `ChatGptSidebarState` contains `projects`, `chats`, `activeChatId`, `activeProjectId`, `searchQuery`, `expandedSections`, and `showAllProjects`.
- `ChatGptSidebarAction` is a discriminated union for the mutations named in Task 1 plus section toggles, active selection, new project, rename, archive, delete chat, and create chat.

- [x] **Step 1: Implement the minimal helper functions**

Keep cookie parsing defensive: trim segments, split only at the first `=`, decode values when possible, and return `undefined` for missing or invalid values. Serialize the boolean as a plain string and keep the max-age caller-supplied.

- [x] **Step 2: Run the focused helper tests**

Run:

```text
npm test -- --test-name-pattern="cookie|shortcut"
```

Expected: PASS.

- [x] **Step 3: Implement the initial ChatGPT fixture and reducer**

Use stable ids (`project-learning`, `project-anyworkflow`, etc.) instead of array indexes. Preserve original chat titles from the research fixture. Reducer updates must return new arrays and keep unrelated state unchanged.

- [x] **Step 4: Run the model tests**

Run:

```text
npm test -- --test-name-pattern="chat|project|search"
```

Expected: PASS.

- [x] **Step 5: Run typecheck for the new pure modules**

Run:

```text
npm run typecheck
```

Expected: PASS before touching the React composition.

---

### Task 3: Harden the reusable sidebar primitives

**Files:**
- Modify: `src/components/chat-sidebar/chat-sidebar.tsx`
- Modify: `src/components/sidebar/index.ts` only if a newly public helper/type must be re-exported
- Test: existing `tests/chat-sidebar-state.test.ts`

**Interfaces:**
- Preserve all current component names and props used by `src/components/chatgpt-home.tsx`.
- `ChatSidebarProvider` continues to accept controlled `open`, uncontrolled `defaultOpen`, `onOpenChange`, `keyboardShortcut`, `cookieName`, width variables, `className`, `style`, and children.

- [x] **Step 1: Replace product-specific default icon coupling**

Remove the import of ChatGPT’s `SidebarToggleIcon` from the generic module. Use a generic Lucide panel icon or an inline neutral SVG for `ChatSidebarTrigger`’s default content. Keep ChatGPT branding available to consumers through their own `children`/`icon` slots.

- [x] **Step 2: Wire the tested helpers into persistence and keyboard handling**

Use `readSidebarCookieState` in the hydration effect and `serializeSidebarCookie` in `setOpen`. Use `matchesSidebarShortcut` with `event.key.toLowerCase()` semantics. Do not write a cookie when the consumer is controlled unless the existing contract explicitly requires it; preserve the current public callback behavior.

- [x] **Step 3: Correct responsive accessibility state**

Make `ChatSidebarTrigger` report `openMobile` on mobile and `open` on desktop. Keep `aria-hidden`/`inert` on the inactive rail/panel, and make the mobile sheet title/description generic and overridable through the existing children slot.

- [x] **Step 4: Preserve action event boundaries and focus behavior**

Ensure the rail background expands the sidebar, while rail buttons stop propagation. If a consumer calls `preventDefault()` in `ChatSidebarTrigger`’s callback, do not toggle. Keep className/style escape hatches intact.

- [x] **Step 5: Run focused tests and typecheck**

Run:

```text
npm test -- --test-concurrency=1
npm run typecheck
```

Expected: PASS.

---

### Task 4: Move ChatGPT-specific behavior into a reusable example composition

**Files:**
- Create: `src/components/chatgpt-sidebar-demo.tsx`
- Modify: `src/components/chatgpt-home.tsx`
- Modify: `src/config/chatgpt-sidebar.ts`
- Modify: `src/components/icons.tsx` only for icons required by the example

**Interfaces:**
- `ChatGptSidebarDemoProps` accepts `onNotice: (message: string) => void` and optional `onNewChat?: () => void`.
- The component imports only the product-neutral aliases from `src/components/sidebar/index.ts` for layout primitives.
- The reducer model is the single source of truth for the example’s project/chat state.

- [x] **Step 1: Create the example component shell and hook up reducer state**

Render the current expanded panel and collapsed rail using the generic primitives. Preserve the inspected 260px/59px/59px dimensions and dark visual tokens in this example file only.

- [x] **Step 2: Add primary navigation and “更多” menu**

Keep the real labels and keyboard hint. Active selection must be visible, and “更多” must open a menu containing 图片, 站点, and GPT links without changing the generic component.

- [x] **Step 3: Add search dialog and filtering**

The expanded header search button opens a dialog with a labeled input. Dispatch `set-search` on input, show matching projects/chats, and close the dialog with Escape or the close action. Empty state copy must be explicit rather than silently rendering an empty list.

- [x] **Step 4: Add controlled section disclosure and project actions**

Use reducer-backed `expandedSections`. The project action menu supports opening a project, renaming, deleting, and creating a project through a small dialog. “查看更多” toggles the extra fixture projects.

- [x] **Step 5: Add chat actions and dialogs**

Chat rows show stable action slots on hover/focus. Implement pin/unpin, rename, archive, delete, and move-to-project. Keep the chat row active while its menu is open and show pinned chats in the pinned section.

- [x] **Step 6: Add account menu and local status feedback**

Keep the account menu labels from the live snapshot. Product actions can remain local notices, but destructive/local mutations must update the model and announce a concise result through the existing status region.

- [x] **Step 7: Update the page shell to consume the example component**

Remove the ChatGPT-specific sidebar implementation from `chatgpt-home.tsx`, retain the composer/header demo, and pass new-chat/status callbacks into `ChatGptSidebarDemo`. Do not alter other routes.

- [x] **Step 8: Run focused tests and a production typecheck**

Run:

```text
npm test -- --test-concurrency=1
npm run lint
npm run typecheck
```

Expected: PASS with no new warnings.

---

### Task 5: Validate visual and responsive behavior in Chrome

**Files:**
- Modify: `docs/research/chatgpt-sidebar/live-behavior.md` if a newly observed state changes the research record
- Modify: `docs/research/components/sidebar-base.spec.md` and `docs/research/components/chatgpt-sidebar.spec.md` if the public contract changes

- [x] **Step 1: Start the local app**

Run `npm run dev` and open the local root and `/sidebar-demo` routes in the connected Chrome session.

- [x] **Step 2: Check desktop expanded state**

At approximately 1440px wide verify the 260px panel, header alignment, section disclosure, project/chat row spacing, hover actions, menus, and status announcements.

- [x] **Step 3: Check collapse and keyboard behavior**

Click the header trigger, hover the rail brand, activate rail shortcuts, and press Ctrl+B/Cmd+B. Verify the main content remains usable and the hidden layer cannot receive focus.

- [x] **Step 4: Check mobile drawer behavior**

At 390px verify the desktop shell is hidden, the hamburger opens a 260px left drawer, overlay dismissal and Escape close it, and the trigger’s `aria-expanded` value tracks the drawer.

- [x] **Step 5: Run the final checks**

Run:

```text
npm run check
```

Expected: lint, typecheck, and production build all pass. Capture screenshots only when a visual discrepancy needs comparison.
