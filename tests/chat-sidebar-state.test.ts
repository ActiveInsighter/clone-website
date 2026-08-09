import test from "node:test"
import assert from "node:assert/strict"

import {
  matchesSidebarShortcut,
  readSidebarCookieState,
  serializeSidebarCookie,
} from "../src/components/chat-sidebar/state.ts"

test("reads the configured boolean cookie and ignores other cookies", () => {
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
})

test("serializes a browser-ready sidebar cookie assignment", () => {
  assert.equal(
    serializeSidebarCookie("chat_sidebar_state", false, 60 * 60 * 24 * 7),
    "chat_sidebar_state=false; path=/; max-age=604800",
  )
})

test("matches the configured modifier shortcut case-insensitively", () => {
  assert.equal(
    matchesSidebarShortcut({ key: "B", ctrlKey: true, metaKey: false }, "b"),
    true,
  )
  assert.equal(
    matchesSidebarShortcut({ key: "b", ctrlKey: false, metaKey: true }, "b"),
    true,
  )
  assert.equal(
    matchesSidebarShortcut({ key: "b", ctrlKey: false, metaKey: false }, "b"),
    false,
  )
})
