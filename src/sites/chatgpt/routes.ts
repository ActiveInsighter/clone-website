import { createChatGptSidebarState } from "./sidebar/model.ts"

const { chats, projects } = createChatGptSidebarState()
export const chatgptPaths = [
  "/", "/library", "/scheduled", "/plugins",
  ...chats.map(({ id }) => `/c/${id}`),
  ...projects.map(({ id }) => `/g/${id}/project`),
] as const
