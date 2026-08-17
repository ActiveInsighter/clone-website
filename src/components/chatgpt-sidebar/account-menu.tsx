import { HelpCircle, LogOut, Pencil, UserRound } from "lucide-react"

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChatGptLogoIcon,
  SettingsCogIcon,
  SidebarToggleIcon,
  UpgradePlanIcon,
} from "@/components/icons"
import { SidebarTrigger } from "@/components/sidebar"
import { chatGptSidebarUser } from "@/config/chatgpt-sidebar"

export type NoticeHandler = (message: string) => void

export function sidebarMenuClassName() {
  return "bg-[#2f2f2f] text-white ring-white/10"
}

export function UserAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#e982b6] font-medium text-[#fff3fa] ${compact ? "size-7 text-[10px]" : "size-8 text-[11px]"}`}
      aria-hidden="true"
    >
      {chatGptSidebarUser.initials.toUpperCase()}
    </span>
  )
}

export function RailBrand() {
  return (
    <SidebarTrigger
      surface="rail"
      tooltip="打开边栏"
      aria-label="打开边栏"
      className="group/rail-brand relative"
    >
      <span className="relative flex size-6 items-center justify-center">
        <ChatGptLogoIcon className="size-6 transition-opacity duration-(--sidebar-motion-fast-duration) group-hover/rail-brand:opacity-0" />
        <SidebarToggleIcon className="absolute size-5 opacity-0 transition-opacity duration-(--sidebar-motion-fast-duration) group-hover/rail-brand:opacity-100" />
      </span>
    </SidebarTrigger>
  )
}

export function SidebarAccountMenu({ onNotice }: { onNotice: NoticeHandler }) {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-2 py-1.5 text-xs text-[#a8a8a8]">
          {chatGptSidebarUser.name}
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator className="bg-white/10" />
      <DropdownMenuItem onClick={() => onNotice("升级套餐入口已准备好。")}>
        <UpgradePlanIcon />
        升级套餐
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onNotice("个性化入口已准备好。")}>
        <UserRound />
        个性化
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onNotice("个人资料入口已准备好。")}>
        <Pencil />
        个人资料
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onNotice("设置入口已准备好。")}>
        <SettingsCogIcon />
        设置
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-white/10" />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <HelpCircle />
          帮助
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className={sidebarMenuClassName()}>
          <DropdownMenuItem onClick={() => onNotice("帮助中心已准备好。")}>
            帮助中心
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNotice("键盘快捷键已准备好。")}>
            键盘快捷键
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem
        variant="destructive"
        onClick={() => onNotice("退出登录入口已准备好。")}
      >
        <LogOut />
        退出登录
      </DropdownMenuItem>
    </>
  )
}
