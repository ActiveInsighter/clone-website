import type { ComponentType } from "react"

import type { IconProps } from "@/components/icons"
import {
  chatGptDemoChatTitles,
  chatGptDemoProjectNames,
} from "@/components/chatgpt-sidebar/data"
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

interface ChatGptSidebarItemBase {
  id: string
  label: string
  icon: ChatGptSidebarIcon
}

export type ChatGptSidebarPrimaryItem =
  | (ChatGptSidebarItemBase & { kind: "route"; href: string })
  | (ChatGptSidebarItemBase & { kind: "command" })

export const chatGptSidebarNewChatItem = {
  id: "new-chat",
  kind: "command",
  label: "新聊天",
  icon: ComposeIcon,
} satisfies ChatGptSidebarPrimaryItem

export const chatGptSidebarPrimaryItems: ChatGptSidebarPrimaryItem[] = [
  {
    id: "library",
    kind: "route",
    label: "文件库",
    icon: LibraryIcon,
    href: "/library",
  },
  {
    id: "scheduled",
    kind: "route",
    label: "已安排",
    icon: ScheduledIcon,
    href: "/scheduled",
  },
  {
    id: "plugins",
    kind: "route",
    label: "插件",
    icon: PluginsIcon,
    href: "/plugins",
  },
  { id: "more", kind: "command", label: "更多", icon: MoreHorizontalIcon },
]

export const chatGptSidebarProjects = chatGptDemoProjectNames

export const chatGptSidebarChats = chatGptDemoChatTitles

export const chatGptSidebarRailItems: ChatGptSidebarPrimaryItem[] = [
  chatGptSidebarNewChatItem,
  { id: "search", kind: "command", label: "搜索", icon: SearchChatsIcon },
  { id: "pinned", kind: "command", label: "已置顶", icon: PinIcon },
  { id: "history", kind: "command", label: "最近聊天", icon: ChatHistoryIcon },
]

export const chatGptSidebarUser = {
  name: "Tom Li",
  plan: "Plus",
  initials: "Tl",
}
