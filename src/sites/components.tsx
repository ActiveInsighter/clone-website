import type { ComponentType } from "react"

import { ChatGptHome } from "./chatgpt/entry"
import { OpenAiHome } from "./openai/entry"
import { StudioDemo } from "./studio/entry"
import type { SiteId } from "./manifest"

export const siteComponents: Record<SiteId, ComponentType> = {
  openai: OpenAiHome,
  chatgpt: ChatGptHome,
  studio: StudioDemo,
}
