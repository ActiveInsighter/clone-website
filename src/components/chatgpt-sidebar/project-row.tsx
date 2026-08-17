import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuActions,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar"
import {
  ArrowTopRightIcon,
  FolderIcon,
  MoreHorizontalIcon,
} from "@/components/icons"
import type { ChatGptSidebarProject } from "./model"
import { sidebarMenuClassName } from "./account-menu"

export type ProjectRowProps = {
  project: ChatGptSidebarProject
  active: boolean
  onSelect: () => void
  onOpenHome: () => void
  onRename: () => void
  onDelete: () => void
}

export function ProjectRow({
  project,
  active,
  onSelect,
  onOpenHome,
  onRename,
  onDelete,
}: ProjectRowProps) {
  return (
    <SidebarMenuItem active={active}>
      <SidebarMenuButton
        render={<Link href={`/g/${project.id}/project`} />}
        nativeButton={false}
        icon={<FolderIcon />}
        aria-current={active ? "page" : undefined}
        onClick={onSelect}
      >
        {project.name}
      </SidebarMenuButton>
      <SidebarMenuActions>
        <SidebarMenuAction
          aria-label={`打开 ${project.name} 的项目首页`}
          tooltip="打开项目首页"
          onClick={onOpenHome}
        >
          <ArrowTopRightIcon />
        </SidebarMenuAction>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuAction aria-label={`打开 ${project.name} 的项目选项`}>
                <MoreHorizontalIcon />
              </SidebarMenuAction>
            }
          />
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={6}
            className={`min-w-[170px] ${sidebarMenuClassName()}`}
          >
            <DropdownMenuItem onClick={onOpenHome}>
              <ArrowTopRightIcon />
              打开项目
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>
              <Pencil />
              重命名
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              删除项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuActions>
    </SidebarMenuItem>
  )
}
