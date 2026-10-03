import type { SiteManifest } from "../types"
import { chatgptPaths } from "./routes.ts"

export const chatgptManifest = {
  id: "chatgpt",
  label: "ChatGPT",
  defaultPath: "/clones/chatgpt",
  paths: chatgptPaths,
  navigation: {
    surface: "chatgpt-compound-sidebar",
    owner: "src/components/sidebar/",
  },
} as const satisfies SiteManifest
