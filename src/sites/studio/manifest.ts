import type { SiteManifest } from "../types"
import { studioPaths } from "./routes.ts"

export const studioManifest = {
  id: "studio",
  label: "Studio",
  defaultPath: "/clones/studio",
  paths: studioPaths,
  navigation: {
    surface: "studio-app-shell",
    owner: "src/components/studio-app-shell/",
  },
} as const satisfies SiteManifest
