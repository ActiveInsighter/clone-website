import Link from "next/link"
import { Archive, FolderInput, Pencil, Share2, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuActions,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar"
import { MoreHorizontalIcon, PinIcon } from "@/components/icons"
import type { ChatGptSidebarChat, ChatGptSidebarProject } from "./model"
import { sidebarMenuClassName } from "./account-menu"

export type ChatRowProps = {
  chat: ChatGptSidebarChat
  projects: ChatGptSidebarProject[]
  active: boolean
  onSelect: () => void
  onTogglePinned: () => void
  onShare: () => void
  onRename: () => void
  onArchive: () => void
  onDelete: () => void
  onMove: (projectId?: string) => void
}

export function ChatRow({
  chat,
  projects,
  active,
  onSelect,
  onTogglePinned,
  onShare,
  onRename,
  onArchive,
  onDelete,
  onMove,
}: ChatRowProps) {
  const pinLabel = chat.pinned ? "取消置顶" : "置顶"

  return (
    <SidebarMenuItem active={active}>
      <SidebarMenuButton
        render={<Link href={`/c/${chat.id}`} />}
        onClick={onSelect}
      >
        {chat.title}
      </SidebarMenuButton>
      <SidebarMenuActions>
        <SidebarMenuAction
          aria-label={`${pinLabel} ${chat.title}`}
          tooltip={pinLabel}
          onClick={onTogglePinned}
        >
          <PinIcon className={chat.pinned ? "fill-current" : undefined} />
        </SidebarMenuAction>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuAction aria-label={`打开“${chat.title}”的对话选项`}>
                <MoreHorizontalIcon />
              </SidebarMenuAction>
            }
          />
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={6}
            className={`min-w-[190px] ${sidebarMenuClassName()}`}
          >
            <DropdownMenuItem onClick={onShare}>
              <Share2 />
              分享
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>
              <Pencil />
              重命名
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onTogglePinned}>
              <PinIcon />
              {chat.pinned ? "取消置顶" : "置顶聊天"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onArchive}>
              <Archive />
              归档
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInput />
                移至项目
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className={sidebarMenuClassName()}>
                <DropdownMenuItem onClick={() => onMove(undefined)}>
                  无项目
                </DropdownMenuItem>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => onMove(project.id)}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuActions>
    </SidebarMenuItem>
  )
}
