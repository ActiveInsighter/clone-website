import type { SiteManifest } from "../types"

export const openaiManifest = {
  id: "openai",
  label: "OpenAI",
  defaultPath: "/clones/openai",
  paths: ["/"],
  navigation: {
    surface: "marketing-top-nav",
    owner: "src/components/openai-navigation/responsive-navigation.tsx",
  },
} as const satisfies SiteManifest
