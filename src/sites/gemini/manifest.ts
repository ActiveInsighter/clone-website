import type { SiteManifest } from "../types"

export const geminiManifest = {
  id: "gemini",
  label: "Gemini",
  defaultPath: "/clones/gemini",
  paths: ["/", "/search", "/library", "/notebooks/create"],
  navigation: {
    surface: "gemini-sidebar",
    owner: "src/components/sidebar/configured-sidebar.tsx",
  },
} as const satisfies SiteManifest
