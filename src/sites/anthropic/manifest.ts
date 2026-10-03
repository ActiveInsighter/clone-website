import type { SiteManifest } from "../types"

export const anthropicManifest = {
  id: "anthropic",
  label: "Anthropic · Opus 5.5",
  defaultPath: "/clones/anthropic/claude-opus-5-5",
  metadata: {
    title: "Introducing Claude Opus 5.5 · Anthropic Clone",
    description: "A faithful Opus 5.5 page with reusable benchmark tables, interactive cost-performance charts, and editorial components.",
  },
  paths: ["/claude-opus-5-5"],
  navigation: {
    surface: "editorial-top-nav",
    owner: "src/sites/anthropic/claude-opus-5-5/",
  },
} as const satisfies SiteManifest
