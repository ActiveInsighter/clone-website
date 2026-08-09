import test from "node:test"
import assert from "node:assert/strict"

import {
  getMenuActionReservationPx,
  getSidebarTriggerExpanded,
  isTextEntryTarget,
  matchesSidebarShortcut,
  readSidebarCookieState,
  reduceSidebarModifierState,
  reduceSidebarPresentationState,
  serializeSidebarCookie,
  shouldHandleSidebarShortcut,
} from "../src/components/sidebar/state.ts"

test("reads a configured boolean cookie and safely ignores malformed values", () => {
  assert.equal(
    readSidebarCookieState(
      "theme=dark; chat_sidebar_state=false; x=1",
      "chat_sidebar_state",
    ),
    false,
  )
  assert.equal(readSidebarCookieState("theme=dark", "chat_sidebar_state"), undefined)
  assert.equal(
    readSidebarCookieState("chat_sidebar_state=not-a-boolean", "chat_sidebar_state"),
    undefined,
  )
  assert.equal(
    readSidebarCookieState("chat_sidebar_state=%E0%A4%A", "chat_sidebar_state"),
    undefined,
  )
})

test("serializes persistence options into a browser-ready sidebar cookie", () => {
  assert.equal(
    serializeSidebarCookie(
      "chat_sidebar_state",
      false,
      {
        maxAge: 60 * 60 * 24 * 7,
        path: "/app",
        sameSite: "strict",
        secure: true,
      },
    ),
    "chat_sidebar_state=false; path=/app; max-age=604800; samesite=strict; secure",
  )
  assert.equal(
    serializeSidebarCookie("chat_sidebar_state", true),
    "chat_sidebar_state=true; path=/; max-age=604800; samesite=lax",
  )
})

test("recognizes text-entry targets, including contenteditable descendants", () => {
  assert.equal(isTextEntryTarget({ tagName: "INPUT" }), true)
  assert.equal(isTextEntryTarget({ tagName: "textarea" }), true)
  assert.equal(isTextEntryTarget({ tagName: "select" }), true)
  assert.equal(isTextEntryTarget({ isContentEditable: true }), true)
  assert.equal(isTextEntryTarget({ hasEditableAncestor: true }), true)
  assert.equal(isTextEntryTarget({ tagName: "button" }), false)
})

test("only handles the sidebar shortcut when it is safe to do so", () => {
  const baseEvent = {
    key: "O",
    ctrlKey: true,
    metaKey: false,
    altKey: false,
    repeat: false,
    isComposing: false,
    defaultPrevented: false,
  }
  const plainTarget = { tagName: "DIV" }

  assert.equal(matchesSidebarShortcut(baseEvent, "o"), true)
  assert.equal(shouldHandleSidebarShortcut(baseEvent, "o", plainTarget), true)
  assert.equal(
    shouldHandleSidebarShortcut(baseEvent, "o", { tagName: "INPUT" }),
    false,
  )
  assert.equal(shouldHandleSidebarShortcut({ ...baseEvent, altKey: true }, "o", plainTarget), false)
  assert.equal(shouldHandleSidebarShortcut({ ...baseEvent, repeat: true }, "o", plainTarget), false)
  assert.equal(shouldHandleSidebarShortcut({ ...baseEvent, isComposing: true }, "o", plainTarget), false)
  assert.equal(
    shouldHandleSidebarShortcut({ ...baseEvent, defaultPrevented: true }, "o", plainTarget),
    false,
  )
})

test("modifier-held state reveals shortcuts without mutating presentation state", () => {
  const initial = { modifierHeld: false }
  const ctrlHeld = reduceSidebarModifierState(initial, {
    type: "keyboard",
    ctrlKey: true,
    metaKey: false,
  })
  const metaHeld = reduceSidebarModifierState(ctrlHeld, {
    type: "keyboard",
    ctrlKey: false,
    metaKey: true,
  })
  const released = reduceSidebarModifierState(metaHeld, {
    type: "keyboard",
    ctrlKey: false,
    metaKey: false,
  })

  assert.equal(ctrlHeld.modifierHeld, true)
  assert.equal(metaHeld.modifierHeld, true)
  assert.equal(released.modifierHeld, false)
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "window-blur" }),
    { modifierHeld: false },
  )
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "page-hide" }),
    { modifierHeld: false },
  )
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "visibility-hidden" }),
    { modifierHeld: false },
  )
})

test("desktop and mobile presentation state never overwrite each other", () => {
  const initial = { desktopOpen: true, mobileOpen: false }
  const desktopClosed = reduceSidebarPresentationState(initial, {
    type: "set-desktop-open",
    open: false,
  })
  const mobileOpened = reduceSidebarPresentationState(desktopClosed, {
    type: "set-mobile-open",
    open: true,
  })

  assert.deepEqual(desktopClosed, { desktopOpen: false, mobileOpen: false })
  assert.deepEqual(mobileOpened, { desktopOpen: false, mobileOpen: true })
  assert.equal(getSidebarTriggerExpanded(mobileOpened, false), false)
  assert.equal(getSidebarTriggerExpanded(mobileOpened, true), true)
})

test("reserves a stable action lane even while actions are visually hidden", () => {
  assert.equal(getMenuActionReservationPx({ actionCount: 0 }), 0)
  assert.equal(
    getMenuActionReservationPx({
      actionCount: 2,
      actionSizePx: 28,
      gapPx: 2,
      inlinePaddingPx: 2,
      endInsetPx: 4,
      safetyPx: 8,
    }),
    74,
  )
  assert.throws(() => getMenuActionReservationPx({ actionCount: -1 }), RangeError)
  assert.throws(() => getMenuActionReservationPx({ actionCount: Number.NaN }), RangeError)
})
