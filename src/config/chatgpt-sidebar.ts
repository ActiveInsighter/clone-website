import type { ComponentType } from "react"

import type { IconProps } from "@/components/icons"
import {
  chatGptDemoChatTitles,
  chatGptDemoProjectNames,
} from "@/components/chatgpt-sidebar-demo/data"
import {
  ChatHistoryIcon,
  ComposeIcon,
  LibraryIcon,
  MoreHorizontalIcon,
  PinIcon,
  PluginsIcon,
  ScheduledIcon,
  SearchChatsIcon,
} from "@/components/icons"

export type ChatGptSidebarIcon = ComponentType<IconProps>

export interface ChatGptSidebarPrimaryItem {
  id: string
  label: string
  icon: ChatGptSidebarIcon
}

export const chatGptSidebarPrimaryItems: ChatGptSidebarPrimaryItem[] = [
  { id: "new-chat", label: "新聊天", icon: ComposeIcon },
  { id: "library", label: "文件库", icon: LibraryIcon },
  { id: "scheduled", label: "已安排", icon: ScheduledIcon },
  { id: "plugins", label: "插件", icon: PluginsIcon },
  { id: "more", label: "更多", icon: MoreHorizontalIcon },
]

export const chatGptSidebarProjects = chatGptDemoProjectNames

export const chatGptSidebarChats = chatGptDemoChatTitles

export const chatGptSidebarRailItems: ChatGptSidebarPrimaryItem[] = [
  { id: "new-chat", label: "新聊天", icon: ComposeIcon },
  { id: "search", label: "搜索", icon: SearchChatsIcon },
  { id: "pinned", label: "已置顶", icon: PinIcon },
  { id: "history", label: "最近聊天", icon: ChatHistoryIcon },
]

export const chatGptSidebarUser = {
  name: "Tom Li",
  plan: "Plus",
  initials: "Tl",
}
