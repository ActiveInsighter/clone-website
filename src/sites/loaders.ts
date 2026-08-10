import type { ComponentType } from "react"

import type { SiteId } from "./manifest"

export type SiteLoader = () => Promise<{
  default: ComponentType
}>

export const siteLoaders: Record<SiteId, SiteLoader> = {
  openai: () => import("./openai/entry"),
  chatgpt: () => import("./chatgpt/entry"),
  studio: () => import("./studio/entry"),
}
