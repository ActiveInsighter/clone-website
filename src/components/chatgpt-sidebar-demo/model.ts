import { chatGptDemoChatTitles } from "./data.ts"

export type ChatGptSidebarSection = "pinned" | "projects" | "chats"

export interface ChatGptSidebarProject {
  id: string
  name: string
}

export interface ChatGptSidebarChat {
  id: string
  title: string
  projectId?: string
  pinned: boolean
  archived: boolean
}

export interface ChatGptSidebarState {
  projects: ChatGptSidebarProject[]
  chats: ChatGptSidebarChat[]
  activeChatId: string | null
  activeProjectId: string | null
  searchQuery: string
  expandedSections: Record<ChatGptSidebarSection, boolean>
  showAllProjects: boolean
}

export type VisibleChatGroups = {
  pinned: ChatGptSidebarChat[]
  regular: ChatGptSidebarChat[]
}

export type ChatGptSidebarRouteSelection =
  | { kind: "home" }
  | { kind: "chat"; id: string }
  | { kind: "project"; id: string }
  | { kind: "primary"; id: "library" | "scheduled" | "plugins" }
  | null

export type ChatGptSidebarSelection = {
  activeChatId: string | null
  activeProjectId: string | null
  newChatActive: boolean
}

export type ChatGptSidebarAction =
  | { type: "toggle-chat-pinned"; chatId: string }
  | { type: "move-chat"; chatId: string; projectId?: string }
  | { type: "set-search"; query: string }
  | { type: "delete-project"; projectId: string }
  | { type: "create-project"; project: ChatGptSidebarProject }
  | { type: "rename-project"; projectId: string; name: string }
  | { type: "select-project"; projectId: string }
  | { type: "select-chat"; chatId: string }
  | { type: "toggle-section"; section: ChatGptSidebarSection }
  | { type: "toggle-all-projects" }
  | { type: "rename-chat"; chatId: string; title: string }
  | { type: "archive-chat"; chatId: string }
  | { type: "delete-chat"; chatId: string }
  | { type: "create-chat"; chat: ChatGptSidebarChat }

const initialProjects: ChatGptSidebarProject[] = [
  { id: "project-learning", name: "学习" },
  { id: "project-anyworkflow", name: "Anyworkflow" },
  { id: "project-pocketbase", name: "pocketbase" },
  { id: "project-fumadocs", name: "fumadocs" },
  { id: "project-review", name: "审查" },
  { id: "project-research", name: "研究" },
  { id: "project-codex", name: "Codex" },
]

const projectIds = initialProjects.map((project) => project.id)
const primaryRouteIds = new Set(["library", "scheduled", "plugins"] as const)

const initialChats: ChatGptSidebarChat[] = chatGptDemoChatTitles.map((title, index) => ({
  id: `chat-${index + 1}`,
  title,
  projectId: index === 0 ? projectIds[0] : index === 1 ? projectIds[1] : undefined,
  pinned: false,
  archived: false,
}))

export function createChatGptSidebarState(): ChatGptSidebarState {
  return {
    projects: initialProjects.map((project) => ({ ...project })),
    chats: initialChats.map((chat) => ({ ...chat })),
    activeChatId: null,
    activeProjectId: null,
    searchQuery: "",
    expandedSections: {
      pinned: false,
      projects: true,
      chats: true,
    },
    showAllProjects: false,
  }
}

export function getSidebarRouteSelection(
  pathname: string,
): ChatGptSidebarRouteSelection {
  if (pathname === "/" || pathname === "/sidebar-demo") {
    return { kind: "home" }
  }

  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 2 && segments[0] === "c") {
    return { kind: "chat", id: segments[1] }
  }
  if (
    segments.length === 3 &&
    segments[0] === "g" &&
    segments[2] === "project"
  ) {
    return { kind: "project", id: segments[1] }
  }
  if (
    segments.length === 1 &&
    primaryRouteIds.has(
      segments[0] as "library" | "scheduled" | "plugins",
    )
  ) {
    return {
      kind: "primary",
      id: segments[0] as "library" | "scheduled" | "plugins",
    }
  }
  return null
}

export function resolveChatGptSidebarSelection(
  pathname: string,
  stateChatId: string | null,
  stateProjectId: string | null,
): ChatGptSidebarSelection {
  const routeSelection = getSidebarRouteSelection(pathname)
  const activeChatId =
    routeSelection?.kind === "chat"
      ? routeSelection.id
      : routeSelection
        ? null
        : stateChatId
  const activeProjectId =
    routeSelection?.kind === "project"
      ? routeSelection.id
      : routeSelection
        ? null
        : stateProjectId

  return {
    activeChatId,
    activeProjectId,
    newChatActive: routeSelection?.kind === "home",
  }
}

export function getVisibleChatGroups(
  chats: readonly ChatGptSidebarChat[],
  query: string,
): VisibleChatGroups {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const matchingChats = chats.filter(
    (chat) =>
      !chat.archived &&
      (!normalizedQuery || chat.title.toLocaleLowerCase().includes(normalizedQuery)),
  )

  return {
    pinned: matchingChats.filter((chat) => chat.pinned),
    regular: matchingChats.filter((chat) => !chat.pinned),
  }
}

export function flattenVisibleChatGroups(
  groups: VisibleChatGroups,
): ChatGptSidebarChat[] {
  return [...groups.pinned, ...groups.regular]
}

export function chatGptSidebarReducer(
  state: ChatGptSidebarState,
  action: ChatGptSidebarAction,
): ChatGptSidebarState {
  switch (action.type) {
    case "toggle-chat-pinned": {
      const chat = state.chats.find((item) => item.id === action.chatId)
      if (!chat) return state
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, pinned: !chat.pinned } : chat,
        ),
      }
    }
    case "move-chat": {
      const chat = state.chats.find((item) => item.id === action.chatId)
      if (!chat || chat.projectId === action.projectId) return state
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, projectId: action.projectId } : chat,
        ),
      }
    }
    case "set-search":
      return state.searchQuery === action.query
        ? state
        : { ...state, searchQuery: action.query }
    case "delete-project": {
      if (!state.projects.some((project) => project.id === action.projectId)) {
        return state
      }
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.projectId),
        chats: state.chats.map((chat) =>
          chat.projectId === action.projectId ? { ...chat, projectId: undefined } : chat,
        ),
        activeProjectId:
          state.activeProjectId === action.projectId ? null : state.activeProjectId,
      }
    }
    case "create-project":
      if (state.projects.some((project) => project.id === action.project.id)) {
        return state
      }
      return { ...state, projects: [...state.projects, { ...action.project }] }
    case "rename-project": {
      const project = state.projects.find((item) => item.id === action.projectId)
      if (!project || project.name === action.name) return state
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.projectId ? { ...project, name: action.name } : project,
        ),
      }
    }
    case "select-project":
      if (!state.projects.some((project) => project.id === action.projectId)) {
        return state
      }
      return { ...state, activeProjectId: action.projectId, activeChatId: null }
    case "select-chat":
      if (!state.chats.some((chat) => chat.id === action.chatId)) return state
      return { ...state, activeChatId: action.chatId, activeProjectId: null }
    case "toggle-section":
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.section]: !state.expandedSections[action.section],
        },
      }
    case "toggle-all-projects":
      return { ...state, showAllProjects: !state.showAllProjects }
    case "rename-chat": {
      const chat = state.chats.find((item) => item.id === action.chatId)
      if (!chat || chat.title === action.title) return state
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, title: action.title } : chat,
        ),
      }
    }
    case "archive-chat": {
      const chat = state.chats.find((item) => item.id === action.chatId)
      if (!chat || chat.archived) return state
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.chatId ? { ...chat, archived: true } : chat,
        ),
        activeChatId: state.activeChatId === action.chatId ? null : state.activeChatId,
      }
    }
    case "delete-chat":
      if (!state.chats.some((chat) => chat.id === action.chatId)) return state
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.id !== action.chatId),
        activeChatId: state.activeChatId === action.chatId ? null : state.activeChatId,
      }
    case "create-chat":
      if (state.chats.some((chat) => chat.id === action.chat.id)) return state
      return {
        ...state,
        chats: [action.chat, ...state.chats],
        activeChatId: action.chat.id,
        activeProjectId: null,
      }
  }
}
