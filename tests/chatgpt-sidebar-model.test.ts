import test from "node:test"
import assert from "node:assert/strict"

import {
  chatGptSidebarReducer,
  createChatGptSidebarState,
} from "../src/components/chatgpt-sidebar-demo/model.ts"

test("pinning a chat moves it into the pinned collection", () => {
  const state = createChatGptSidebarState()
  const chatId = state.chats[0].id
  const next = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId })

  assert.deepEqual(
    next.chats.filter((chat) => chat.pinned).map((chat) => chat.id),
    [chatId],
  )
})

test("moving a chat changes its project without removing it from chat history", () => {
  const state = createChatGptSidebarState()
  const chatId = state.chats[0].id
  const projectId = state.projects[1].id
  const next = chatGptSidebarReducer(state, { type: "move-chat", chatId, projectId })

  assert.equal(next.chats.find((chat) => chat.id === chatId)?.projectId, projectId)
  assert.equal(next.chats.some((chat) => chat.id === chatId), true)
})

test("search keeps the query so the view can filter chats and projects", () => {
  const state = chatGptSidebarReducer(createChatGptSidebarState(), {
    type: "set-search",
    query: "workflow",
  })

  assert.equal(state.searchQuery, "workflow")
  assert.equal(state.projects.some((project) => project.name === "Anyworkflow"), true)
})

test("deleting a project also removes its project assignment from chats", () => {
  const state = createChatGptSidebarState()
  const projectId = state.projects[0].id
  const next = chatGptSidebarReducer(state, { type: "delete-project", projectId })

  assert.equal(next.projects.some((project) => project.id === projectId), false)
  assert.equal(next.chats.some((chat) => chat.projectId === projectId), false)
})
