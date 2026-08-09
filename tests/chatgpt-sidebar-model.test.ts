import test from "node:test"
import assert from "node:assert/strict"

import {
  chatGptSidebarReducer,
  createChatGptSidebarState,
  flattenVisibleChatGroups,
  getVisibleChatGroups,
} from "../src/components/chatgpt-sidebar-demo/model.ts"

test("visible chats have a continuous pinned prefix with stable group order", () => {
  let state = createChatGptSidebarState()
  state = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId: "chat-3" })
  state = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId: "chat-1" })

  const groups = getVisibleChatGroups(state.chats, "")
  const visible = flattenVisibleChatGroups(groups)

  assert.deepEqual(groups.pinned.map((chat) => chat.id), ["chat-1", "chat-3"])
  assert.deepEqual(visible.slice(0, 2).map((chat) => chat.id), ["chat-1", "chat-3"])
  assert.equal(visible.findIndex((chat) => !chat.pinned), 2)
  assert.equal(visible.slice(2).some((chat) => chat.pinned), false)
  assert.equal(new Set(visible.map((chat) => chat.id)).size, visible.length)
})

test("pin, archive, delete, and query preserve the visible pinned prefix", () => {
  let state = createChatGptSidebarState()
  state = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId: "chat-1" })
  state = chatGptSidebarReducer(state, { type: "toggle-chat-pinned", chatId: "chat-2" })
  state = chatGptSidebarReducer(state, { type: "archive-chat", chatId: "chat-1" })
  state = chatGptSidebarReducer(state, { type: "delete-chat", chatId: "chat-3" })

  const groups = getVisibleChatGroups(state.chats, "")
  const visible = flattenVisibleChatGroups(groups)
  assert.deepEqual(groups.pinned.map((chat) => chat.id), ["chat-2"])
  assert.equal(visible.some((chat) => chat.id === "chat-1"), false)
  assert.equal(visible.some((chat) => chat.id === "chat-3"), false)
  assert.equal(visible.slice(groups.pinned.length).some((chat) => chat.pinned), false)

  const noMatch = getVisibleChatGroups(state.chats, "not a chat title")
  assert.deepEqual(flattenVisibleChatGroups(noMatch), [])
})

test("moving a chat changes its project without removing it or mutating the input", () => {
  const state = createChatGptSidebarState()
  const chatId = state.chats[0].id
  const projectId = state.projects[1].id
  const next = chatGptSidebarReducer(state, { type: "move-chat", chatId, projectId })

  assert.equal(next.chats.find((chat) => chat.id === chatId)?.projectId, projectId)
  assert.equal(next.chats.some((chat) => chat.id === chatId), true)
  assert.equal(state.chats.find((chat) => chat.id === chatId)?.projectId, "project-learning")
})

test("deleting a project clears its active selection and chat assignments", () => {
  const state = chatGptSidebarReducer(createChatGptSidebarState(), {
    type: "select-project",
    projectId: "project-learning",
  })
  const next = chatGptSidebarReducer(state, {
    type: "delete-project",
    projectId: "project-learning",
  })

  assert.equal(next.projects.some((project) => project.id === "project-learning"), false)
  assert.equal(next.chats.some((chat) => chat.projectId === "project-learning"), false)
  assert.equal(next.activeProjectId, null)
})

test("destructive chat actions clear active selection", () => {
  const selected = chatGptSidebarReducer(createChatGptSidebarState(), {
    type: "select-chat",
    chatId: "chat-1",
  })
  const archived = chatGptSidebarReducer(selected, { type: "archive-chat", chatId: "chat-1" })
  assert.equal(archived.activeChatId, null)

  const deleted = chatGptSidebarReducer(selected, { type: "delete-chat", chatId: "chat-1" })
  assert.equal(deleted.activeChatId, null)
})

test("unknown ids are referential no-ops", () => {
  const state = createChatGptSidebarState()
  const unknownChatActions = [
    { type: "toggle-chat-pinned", chatId: "missing" },
    { type: "move-chat", chatId: "missing", projectId: "project-learning" },
    { type: "rename-chat", chatId: "missing", title: "renamed" },
    { type: "archive-chat", chatId: "missing" },
    { type: "delete-chat", chatId: "missing" },
    { type: "select-chat", chatId: "missing" },
  ] as const

  for (const action of unknownChatActions) {
    assert.equal(chatGptSidebarReducer(state, action), state)
  }
  assert.equal(
    chatGptSidebarReducer(state, { type: "delete-project", projectId: "missing" }),
    state,
  )
  assert.equal(
    chatGptSidebarReducer(state, { type: "select-project", projectId: "missing" }),
    state,
  )
  assert.equal(
    chatGptSidebarReducer(state, {
      type: "rename-project",
      projectId: "missing",
      name: "renamed",
    }),
    state,
  )
})

test("duplicate create actions are no-ops and accepted creates are immutable", () => {
  const state = createChatGptSidebarState()
  assert.equal(
    chatGptSidebarReducer(state, {
      type: "create-project",
      project: { id: "project-learning", name: "duplicate" },
    }),
    state,
  )
  assert.equal(
    chatGptSidebarReducer(state, {
      type: "create-chat",
      chat: { ...state.chats[0], title: "duplicate" },
    }),
    state,
  )

  const next = chatGptSidebarReducer(state, {
    type: "create-chat",
    chat: { id: "chat-new", title: "New chat", pinned: false, archived: false },
  })
  assert.equal(next.chats[0].id, "chat-new")
  assert.equal(state.chats.some((chat) => chat.id === "chat-new"), false)
  assert.notEqual(next.chats, state.chats)
})
