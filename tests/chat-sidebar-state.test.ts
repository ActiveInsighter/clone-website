import test from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import * as sidebarState from "../src/components/sidebar/state.ts"

import {
  isTextEntryTarget,
  matchesSidebarShortcut,
  readSidebarCookieState,
  reduceSidebarModifierState,
  reduceSidebarPresentationState,
  serializeSidebarCookie,
  shouldHandleSidebarShortcut,
} from "../src/components/sidebar/state.ts"
import {
  createSidebarTokenStyle,
  SIDEBAR_MOBILE_QUERY,
} from "../src/components/sidebar/tokens.ts"
import type { SidebarTriggerProps } from "../src/components/sidebar/controls.tsx"
import type { SidebarPanelProps } from "../src/components/sidebar/shell.tsx"
import { resolveSidebarInteractiveProps } from "../src/components/sidebar/interactive.ts"

type Assert<T extends true> = T
type Equal<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false

export type SidebarTriggerSurfaceIsRequired = Assert<
  Pick<SidebarTriggerProps, "surface"> extends Required<
    Pick<SidebarTriggerProps, "surface">
  >
    ? true
    : false
>

export type SidebarPanelSupportsOptionalFixedPrefix = Assert<
  Equal<SidebarPanelProps["children"]["length"], 3 | 4>
>

test("hands focus across surfaces only after the effective desktop state changes", () => {
  const candidate = (
    sidebarState as unknown as {
      getSidebarFocusHandoffSurface?: (
        open: boolean,
        activeSurface: "panel" | "rail" | null,
      ) => "panel" | "rail" | null
    }
  ).getSidebarFocusHandoffSurface

  assert.equal(typeof candidate, "function")
  const getHandoff = candidate as (
    open: boolean,
    activeSurface: "panel" | "rail" | null,
  ) => "panel" | "rail" | null

  assert.equal(getHandoff(true, "rail"), "panel")
  assert.equal(getHandoff(false, "panel"), "rail")
  assert.equal(getHandoff(true, "panel"), null)
  assert.equal(getHandoff(false, "rail"), null)
  assert.equal(getHandoff(true, null), null)
})

test("returns focus to the exact connected mobile opener before any fallback", () => {
  const candidate = (
    sidebarState as unknown as {
      resolveSidebarFocusReturn?: <T extends { isConnected: boolean }>(
        opener: T | null,
        fallback: T | null,
      ) => T | null
    }
  ).resolveSidebarFocusReturn

  assert.equal(typeof candidate, "function")
  const resolveFocusReturn = candidate as <T extends { isConnected: boolean }>(
    opener: T | null,
    fallback: T | null,
  ) => T | null
  const opener = { id: "clicked-opener", isConnected: true }
  const fallback = { id: "last-registered", isConnected: true }

  assert.equal(resolveFocusReturn(opener, fallback), opener)
  assert.equal(
    resolveFocusReturn({ ...opener, isConnected: false }, fallback),
    fallback,
  )
  assert.equal(
    resolveFocusReturn(
      { ...opener, isConnected: false },
      { ...fallback, isConnected: false },
    ),
    null,
  )
})

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
  const initial = { modifierHeld: false, modifierKey: null }
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
  assert.equal(
    (ctrlHeld as typeof ctrlHeld & { modifierKey?: string }).modifierKey,
    "control",
  )
  assert.equal(metaHeld.modifierHeld, true)
  assert.equal(
    (metaHeld as typeof metaHeld & { modifierKey?: string }).modifierKey,
    "meta",
  )
  assert.equal(released.modifierHeld, false)
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "window-blur" }),
    { modifierHeld: false, modifierKey: null },
  )
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "page-hide" }),
    { modifierHeld: false, modifierKey: null },
  )
  assert.deepEqual(
    reduceSidebarModifierState(metaHeld, { type: "visibility-hidden" }),
    { modifierHeld: false, modifierKey: null },
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
})

test("keeps the layout gutter independent from the visible scrollbar size", () => {
  const style = createSidebarTokenStyle({
    "--sidebar-scrollbar-size": "1rem",
  })

  assert.equal(style["--sidebar-scrollbar-size"], "1rem")
  assert.equal(style["--sidebar-scrollbar-gutter"], "0.625rem")
  assert.equal(style["--sidebar-line-height"], "1.375rem")
})

test("includes the 768px tablet viewport in the mobile presentation", () => {
  assert.equal(SIDEBAR_MOBILE_QUERY, "(max-width: 48rem)")
})

test("polymorphic controls preserve native button and link semantics", () => {
  const renderedButton = resolveSidebarInteractiveProps({
    render: React.createElement("button"),
    disabled: false,
  })
  assert.equal(renderedButton.nativeButton, true)
  assert.equal(renderedButton.type, "button")

  const renderedLink = resolveSidebarInteractiveProps({
    render: React.createElement("a", { href: "/library" }),
    nativeButton: false,
    disabled: true,
    tabIndex: 0,
  })
  assert.equal(renderedLink.nativeButton, false)
  assert.equal(renderedLink.type, undefined)
  assert.equal(renderedLink.disabled, undefined)
  assert.equal(renderedLink.ariaDisabled, true)
  assert.equal(renderedLink.tabIndex, -1)

  const callbackButton = resolveSidebarInteractiveProps({
    render: () => React.createElement("button"),
    type: "submit",
  })
  assert.equal(callbackButton.nativeButton, true)
  assert.equal(callbackButton.type, "submit")
})
