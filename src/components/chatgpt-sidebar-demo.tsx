"use client"

import * as React from "react"
import Link from "next/link"
import {
  Archive,
  FolderInput,
  HelpCircle,
  LogOut,
  Pencil,
  Share2,
  Trash2,
  UserRound,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarIconButton,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuActions,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarRailButton,
  SidebarRailHeader,
  SidebarRailSpacer,
  SidebarSection,
  SidebarSectionAction,
  SidebarTrigger,
  useSidebar,
} from "@/components/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  chatGptSidebarPrimaryItems,
  chatGptSidebarRailItems,
  chatGptSidebarUser,
} from "@/config/chatgpt-sidebar"
import {
  ArrowTopRightIcon,
  ChatGptLogoIcon,
  ChatHistoryIcon,
  CloseIcon,
  ComposeIcon,
  DownloadAppIcon,
  FolderIcon,
  ImagesIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
  SearchChatsIcon,
  SettingsCogIcon,
  SidebarToggleIcon,
  UpgradePlanIcon,
} from "@/components/icons"
import type {
  ChatGptSidebarChat,
  ChatGptSidebarProject,
  ChatGptSidebarSection,
  ChatGptSidebarState,
} from "./chatgpt-sidebar-demo/model"
import {
  chatGptSidebarReducer,
  createChatGptSidebarState,
} from "./chatgpt-sidebar-demo/model"

type NoticeHandler = (message: string) => void

type SidebarDialogState =
  | { kind: "create-project" }
  | { kind: "rename-project"; projectId: string }
  | { kind: "rename-chat"; chatId: string }
  | null

function UserAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#e982b6] font-medium text-[#fff3fa] ${compact ? "size-7 text-[10px]" : "size-8 text-[11px]"}`}
      aria-hidden="true"
    >
      {chatGptSidebarUser.initials.toUpperCase()}
    </span>
  )
}

function RailBrand({ onClick }: { onClick: () => void }) {
  return (
    <SidebarRailButton
      tooltip="打开边栏"
      aria-label="打开边栏"
      onClick={onClick}
      className="group/rail-brand relative"
      icon={
        <span className="relative flex size-6 items-center justify-center">
          <ChatGptLogoIcon className="size-6 transition-opacity duration-100 group-hover/rail-brand:opacity-0" />
          <SidebarToggleIcon className="absolute size-5 opacity-0 transition-opacity duration-100 group-hover/rail-brand:opacity-100" />
        </span>
      }
    />
  )
}

function menuClassName() {
  return "bg-[#2f2f2f] text-white ring-white/10"
}

function SidebarAccountMenu({ onNotice }: { onNotice: NoticeHandler }) {
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
        <DropdownMenuSubContent className={menuClassName()}>
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

function matchesQuery(value: string, query: string) {
  return !query || value.toLocaleLowerCase().includes(query)
}

function getDialogValue(
  dialog: Exclude<SidebarDialogState, null>,
  state: ChatGptSidebarState,
) {
  if (dialog.kind === "create-project") return ""
  if (dialog.kind === "rename-project") {
    return state.projects.find((project) => project.id === dialog.projectId)?.name ?? ""
  }
  return state.chats.find((chat) => chat.id === dialog.chatId)?.title ?? ""
}

function ProjectRow({
  project,
  active,
  onSelect,
  onOpenHome,
  onRename,
  onDelete,
}: {
  project: ChatGptSidebarProject
  active: boolean
  onSelect: () => void
  onOpenHome: () => void
  onRename: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        icon={<FolderIcon />}
        isActive={active || menuOpen}
        className="pr-[4.75rem]"
        onClick={onSelect}
      >
        {project.name}
      </SidebarMenuButton>
      <SidebarMenuActions open={menuOpen}>
        <SidebarMenuAction
          aria-label={`打开 ${project.name} 的项目首页`}
          tooltip="打开项目首页"
          className="static size-7 translate-y-0 opacity-100"
          onClick={onOpenHome}
        >
          <ArrowTopRightIcon />
        </SidebarMenuAction>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuAction
                aria-label={`打开 ${project.name} 的项目选项`}
                className="static size-7 translate-y-0 opacity-100"
              >
                <MoreHorizontalIcon />
              </SidebarMenuAction>
            }
          />
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={6}
            className={`min-w-[170px] ${menuClassName()}`}
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

function ChatHistoryRow({
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
}: {
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
}) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pinLabel = chat.pinned ? "取消置顶" : "置顶"

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active || menuOpen}
        className="pr-[4.75rem]"
        onClick={onSelect}
      >
        {chat.title}
      </SidebarMenuButton>
      <SidebarMenuActions open={menuOpen}>
        <SidebarMenuAction
          aria-label={`${pinLabel} ${chat.title}`}
          tooltip={pinLabel}
          className="static size-7 translate-y-0 opacity-100"
          onClick={onTogglePinned}
        >
          <PinIcon className={chat.pinned ? "fill-current" : undefined} />
        </SidebarMenuAction>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuAction
                aria-label={`打开“${chat.title}”的对话选项`}
                className="static size-7 translate-y-0 opacity-100"
              >
                <MoreHorizontalIcon />
              </SidebarMenuAction>
            }
          />
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={6}
            className={`min-w-[190px] ${menuClassName()}`}
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
              <DropdownMenuSubContent className={menuClassName()}>
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

function SearchDialog({
  open,
  onOpenChange,
  query,
  projects,
  chats,
  onQueryChange,
  onSelectProject,
  onSelectChat,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  projects: ChatGptSidebarProject[]
  chats: ChatGptSidebarChat[]
  onQueryChange: (query: string) => void
  onSelectProject: (projectId: string) => void
  onSelectChat: (chatId: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#2f2f2f] text-white sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
          <DialogDescription className="text-[#a8a8a8]">
            搜索项目和聊天记录
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <SearchChatsIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#a8a8a8]" />
          <input
            autoFocus
            aria-label="搜索项目和聊天记录"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索项目和聊天记录"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/20 pl-10 pr-10 text-sm text-white outline-none placeholder:text-[#888] focus:border-white/25"
          />
          {query ? (
            <button
              type="button"
              aria-label="清除搜索"
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#a8a8a8] hover:bg-white/10 hover:text-white"
              onClick={() => onQueryChange("")}
            >
              <CloseIcon className="size-4" />
            </button>
          ) : null}
        </div>
        <div className="max-h-[310px] overflow-y-auto rounded-lg border border-white/10 bg-black/10 p-1">
          {projects.length === 0 && chats.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[#a8a8a8]">
              没有匹配的项目或聊天
            </p>
          ) : (
            <>
              {projects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    onSelectProject(project.id)
                    onOpenChange(false)
                  }}
                >
                  <FolderIcon className="size-4 text-[#bcbcbc]" />
                  <span className="truncate">{project.name}</span>
                  <span className="ml-auto text-xs text-[#777]">项目</span>
                </button>
              ))}
              {chats.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    onSelectChat(chat.id)
                    onOpenChange(false)
                  }}
                >
                  <ChatHistoryIcon className="size-4 text-[#bcbcbc]" />
                  <span className="truncate">{chat.title}</span>
                  <span className="ml-auto text-xs text-[#777]">聊天</span>
                </button>
              ))}
            </>
          )}
        </div>
        <DialogFooter>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm text-[#cfcfcf] hover:bg-white/10 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            关闭
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditDialog({
  dialog,
  value,
  onValueChange,
  onOpenChange,
  onSubmit,
}: {
  dialog: Exclude<SidebarDialogState, null>
  value: string
  onValueChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  const title =
    dialog.kind === "create-project"
      ? "新建项目"
      : dialog.kind === "rename-project"
        ? "重命名项目"
        : "重命名聊天"

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#2f2f2f] text-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-[#a8a8a8]">
              这里只修改本地示例数据。
            </DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            aria-label="名称"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className="mt-4 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-[#888] focus:border-white/25"
          />
          <DialogFooter className="mt-4">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm text-[#cfcfcf] hover:bg-white/10 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="rounded-md bg-white px-3 py-2 text-sm text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              保存
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export type ChatGptSidebarDemoProps = {
  onNotice: NoticeHandler
  onNewChat?: () => void
}

export function ChatGptSidebarDemo({
  onNotice,
  onNewChat,
}: ChatGptSidebarDemoProps) {
  const { toggleSidebar } = useSidebar()
  const [state, dispatch] = React.useReducer(
    chatGptSidebarReducer,
    undefined,
    createChatGptSidebarState,
  )
  const [activePrimaryId, setActivePrimaryId] = React.useState("new-chat")
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [dialog, setDialog] = React.useState<SidebarDialogState>(null)
  const [dialogValue, setDialogValue] = React.useState("")

  const query = state.searchQuery.trim().toLocaleLowerCase()
  const visibleProjects = state.projects
    .slice(0, state.showAllProjects ? state.projects.length : 5)
    .filter((project) => matchesQuery(project.name, query))
  const visibleChats = state.chats.filter(
    (chat) => !chat.archived && matchesQuery(chat.title, query),
  )
  const pinnedChats = visibleChats.filter((chat) => chat.pinned)
  const regularChats = visibleChats.filter((chat) => !chat.pinned)
  const searchProjects = state.projects.filter((project) =>
    matchesQuery(project.name, query),
  )
  const searchChats = visibleChats

  function announce(message: string) {
    onNotice(message)
  }

  function handleNewChat() {
    setActivePrimaryId("new-chat")
    onNewChat?.()
    announce("已准备好新聊天。")
  }

  function handlePrimaryItem(id: string, label: string) {
    if (id === "new-chat") {
      handleNewChat()
      return
    }
    setActivePrimaryId(id)
    announce(`${label} 已在本地示例中选中。`)
  }

  function handleRailItem(id: string, label: string) {
    if (id === "new-chat") {
      handleNewChat()
    } else if (id === "search") {
      setSearchOpen(true)
    } else if (id === "pinned") {
      if (!state.expandedSections.pinned) {
        dispatch({ type: "toggle-section", section: "pinned" })
      }
      announce("已打开已置顶聊天。")
    } else {
      announce(`${label}入口已准备好。`)
    }
  }

  function setSectionOpen(section: ChatGptSidebarSection, open: boolean) {
    if (state.expandedSections[section] !== open) {
      dispatch({ type: "toggle-section", section })
    }
  }

  function openDialog(nextDialog: Exclude<SidebarDialogState, null>) {
    setDialog(nextDialog)
    setDialogValue(getDialogValue(nextDialog, state))
  }

  function submitDialog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = dialogValue.trim()
    if (!dialog || !value) return

    if (dialog.kind === "create-project") {
      const id = `project-${value.toLocaleLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")}-${Date.now()}`
      dispatch({ type: "create-project", project: { id, name: value } })
      announce(`项目“${value}”已创建。`)
    } else if (dialog.kind === "rename-project") {
      dispatch({ type: "rename-project", projectId: dialog.projectId, name: value })
      announce(`项目已重命名为“${value}”。`)
    } else {
      dispatch({ type: "rename-chat", chatId: dialog.chatId, title: value })
      announce(`聊天已重命名为“${value}”。`)
    }
    setDialog(null)
  }

  function selectProject(projectId: string) {
    dispatch({ type: "select-project", projectId })
    const project = state.projects.find((item) => item.id === projectId)
    announce(`已打开项目“${project?.name ?? "项目"}”。`)
  }

  function selectChat(chatId: string) {
    dispatch({ type: "select-chat", chatId })
    const chat = state.chats.find((item) => item.id === chatId)
    announce(`已打开聊天“${chat?.title ?? "聊天"}”。`)
  }

  function togglePinned(chat: ChatGptSidebarChat) {
    dispatch({ type: "toggle-chat-pinned", chatId: chat.id })
    announce(chat.pinned ? `“${chat.title}”已取消置顶。` : `“${chat.title}”已置顶。`)
  }

  function moveChat(chat: ChatGptSidebarChat, projectId?: string) {
    dispatch({ type: "move-chat", chatId: chat.id, projectId })
    const projectName = state.projects.find((project) => project.id === projectId)?.name
    announce(
      projectName
        ? `“${chat.title}”已移至项目“${projectName}”。`
        : `“${chat.title}”已移出项目。`,
    )
  }

  const rail = (
    <SidebarRail aria-label="侧边栏">
      <SidebarRailHeader>
        <RailBrand onClick={toggleSidebar} />
      </SidebarRailHeader>
      <div className="mt-2 flex w-full flex-col gap-0">
        {chatGptSidebarRailItems.map((item) => {
          const Icon = item.icon
          return (
            <SidebarRailButton
              key={item.id}
              icon={<Icon />}
              tooltip={item.label}
              aria-label={item.label}
              onClick={() => handleRailItem(item.id, item.label)}
            />
          )
        })}
      </div>
      <SidebarRailSpacer />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarRailButton
              aria-label="打开“个人资料”菜单"
              className="mb-1.5"
            >
              <UserAvatar compact />
            </SidebarRailButton>
          }
        />
        <DropdownMenuContent side="right" align="end" sideOffset={8} className={`w-[230px] ${menuClassName()}`}>
          <SidebarAccountMenu onNotice={announce} />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarRail>
  )

  return (
    <>
      <Sidebar rail={rail} role="navigation" aria-label="历史聊天记录">
        <SidebarHeader className="px-[9px]">
          <Link
            href="/"
            aria-label="主页"
            className="flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-[9px] px-2.5 text-left text-[15px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            onClick={(event) => {
              event.preventDefault()
              announce("主页已在本地示例中打开。")
            }}
          >
            <ChatGptLogoIcon className="size-5 shrink-0" />
            <span className="truncate">ChatGPT Plus</span>
          </Link>
          <div className="flex shrink-0 items-center">
            <SidebarIconButton
              tooltip="搜索"
              aria-label="搜索"
              onClick={() => setSearchOpen(true)}
            >
              <SearchChatsIcon />
            </SidebarIconButton>
            <SidebarTrigger tooltip="关闭边栏" aria-label="关闭边栏">
              <SidebarToggleIcon />
            </SidebarTrigger>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarSection sticky className="pt-2">
            <SidebarMenu>
              {chatGptSidebarPrimaryItems.map((item) => {
                const Icon = item.icon
                if (item.id === "more") {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                        <DropdownMenuTrigger
                          render={
                            <SidebarMenuButton
                              icon={<Icon />}
                              isActive={moreOpen || activePrimaryId === item.id}
                            >
                              {item.label}
                            </SidebarMenuButton>
                          }
                        />
                        <DropdownMenuContent side="right" align="start" sideOffset={6} className={`min-w-[150px] ${menuClassName()}`}>
                          <DropdownMenuItem onClick={() => announce("图片入口已准备好。")}>
                            <ImagesIcon />
                            图片
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => announce("站点入口已准备好。") }>
                            <ArrowTopRightIcon />
                            站点 <span className="ml-auto text-[10px] text-[#a8a8a8]">新</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => announce("GPT 入口已准备好。") }>
                            <ChatGptLogoIcon />
                            GPT
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                }
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      icon={<Icon />}
                      isActive={activePrimaryId === item.id}
                      trailing={
                        item.id === "new-chat" ? (
                          <kbd className="pointer-events-none flex items-center gap-0.5 text-[10px] text-sidebar-muted-foreground">
                            <span>Ctrl</span>
                            <span>Shift</span>
                            <span>O</span>
                          </kbd>
                        ) : undefined
                      }
                      onClick={() => handlePrimaryItem(item.id, item.label)}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarSection>

          <SidebarSection
            label="已置顶"
            collapsible
            open={state.expandedSections.pinned}
            onOpenChange={(open) => setSectionOpen("pinned", open)}
            className="pt-3"
          >
            <SidebarMenu className="mt-0.5">
              {pinnedChats.length > 0 ? (
                pinnedChats.map((chat) => (
                  <ChatHistoryRow
                    key={chat.id}
                    chat={chat}
                    projects={state.projects}
                    active={state.activeChatId === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onTogglePinned={() => togglePinned(chat)}
                    onShare={() => {
                      selectChat(chat.id)
                      announce(`“${chat.title}”的分享入口已准备好。`)
                    }}
                    onRename={() => openDialog({ kind: "rename-chat", chatId: chat.id })}
                    onArchive={() => {
                      dispatch({ type: "archive-chat", chatId: chat.id })
                      announce(`“${chat.title}”已归档。`)
                    }}
                    onDelete={() => {
                      dispatch({ type: "delete-chat", chatId: chat.id })
                      announce(`“${chat.title}”已删除。`)
                    }}
                    onMove={(projectId) => moveChat(chat, projectId)}
                  />
                ))
              ) : (
                <li className="px-[18px] py-2 text-[13px] text-sidebar-muted-foreground">
                  暂无已置顶聊天
                </li>
              )}
            </SidebarMenu>
          </SidebarSection>

          <SidebarSection
            label="项目"
            collapsible
            open={state.expandedSections.projects}
            onOpenChange={(open) => setSectionOpen("projects", open)}
            className="pt-3"
            action={
              <span className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarSectionAction tooltip="整理项目" aria-label="整理项目">
                        <MoreHorizontalIcon />
                      </SidebarSectionAction>
                    }
                  />
                  <DropdownMenuContent side="right" align="start" sideOffset={6} className={`min-w-[150px] ${menuClassName()}`}>
                    <DropdownMenuItem onClick={() => announce("整理项目入口已准备好。")}>
                      整理聊天
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDialog({ kind: "create-project" })}>
                      <PlusIcon />
                      新项目
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SidebarSectionAction
                  tooltip="新项目"
                  aria-label="新项目"
                  onClick={() => openDialog({ kind: "create-project" })}
                >
                  <PlusIcon />
                </SidebarSectionAction>
              </span>
            }
          >
            <SidebarMenu className="mt-0.5">
              {visibleProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  active={state.activeProjectId === project.id}
                  onSelect={() => selectProject(project.id)}
                  onOpenHome={() => {
                    selectProject(project.id)
                    announce(`已打开项目“${project.name}”首页。`)
                  }}
                  onRename={() => openDialog({ kind: "rename-project", projectId: project.id })}
                  onDelete={() => {
                    dispatch({ type: "delete-project", projectId: project.id })
                    announce(`项目“${project.name}”已删除。`)
                  }}
                />
              ))}
              {state.projects.length > 5 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => dispatch({ type: "toggle-all-projects" })}>
                    {state.showAllProjects ? "收起项目" : "查看更多"}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              {visibleProjects.length === 0 ? (
                <li className="px-[18px] py-2 text-[13px] text-sidebar-muted-foreground">
                  没有匹配的项目
                </li>
              ) : null}
            </SidebarMenu>
          </SidebarSection>

          <SidebarSection
            label="聊天"
            collapsible
            open={state.expandedSections.chats}
            onOpenChange={(open) => setSectionOpen("chats", open)}
            className="pt-3"
            action={
              <span className="flex items-center">
                <SidebarSectionAction
                  tooltip="整理聊天"
                  aria-label="整理聊天"
                  onClick={() => announce("整理聊天入口已准备好。")}
                >
                  <MoreHorizontalIcon />
                </SidebarSectionAction>
                <SidebarSectionAction
                  tooltip="新聊天"
                  aria-label="新聊天"
                  onClick={handleNewChat}
                >
                  <ComposeIcon />
                </SidebarSectionAction>
              </span>
            }
          >
            <SidebarMenu className="mt-0.5">
              {regularChats.map((chat) => (
                <ChatHistoryRow
                  key={chat.id}
                  chat={chat}
                  projects={state.projects}
                  active={state.activeChatId === chat.id}
                  onSelect={() => selectChat(chat.id)}
                  onTogglePinned={() => togglePinned(chat)}
                  onShare={() => {
                    selectChat(chat.id)
                    announce(`“${chat.title}”的分享入口已准备好。`)
                  }}
                  onRename={() => openDialog({ kind: "rename-chat", chatId: chat.id })}
                  onArchive={() => {
                    dispatch({ type: "archive-chat", chatId: chat.id })
                    announce(`“${chat.title}”已归档。`)
                  }}
                  onDelete={() => {
                    dispatch({ type: "delete-chat", chatId: chat.id })
                    announce(`“${chat.title}”已删除。`)
                  }}
                  onMove={(projectId) => moveChat(chat, projectId)}
                />
              ))}
              {regularChats.length === 0 ? (
                <li className="px-[18px] py-2 text-[13px] text-sidebar-muted-foreground">
                  没有匹配的聊天
                </li>
              ) : null}
            </SidebarMenu>
          </SidebarSection>
        </SidebarContent>

        <SidebarFooter className="border-0 px-2.5 py-1.5">
          <div className="flex h-[52px] w-full items-center gap-2 rounded-[10px] px-2 transition-colors hover:bg-sidebar-accent">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`${chatGptSidebarUser.name} ${chatGptSidebarUser.plan}，打开“个人资料”菜单`}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-[9px] text-left outline-none focus-visible:bg-sidebar-accent"
              >
                <UserAvatar />
                <span className="min-w-0 flex-1 leading-[18px]">
                  <span className="block truncate text-[14px] text-sidebar-foreground">
                    {chatGptSidebarUser.name}
                  </span>
                  <span className="block text-[13px] text-sidebar-muted-foreground">
                    {chatGptSidebarUser.plan}
                  </span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" sideOffset={6} className={`w-[230px] ${menuClassName()}`}>
                <SidebarAccountMenu onNotice={announce} />
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarIconButton
              tooltip="下载应用"
              aria-label="下载应用"
              onClick={() => announce("下载应用入口已准备好。")}
            >
              <DownloadAppIcon />
            </SidebarIconButton>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={state.searchQuery}
        projects={searchProjects}
        chats={searchChats}
        onQueryChange={(queryValue) => dispatch({ type: "set-search", query: queryValue })}
        onSelectProject={(projectId) => {
          selectProject(projectId)
          setActivePrimaryId("new-chat")
        }}
        onSelectChat={(chatId) => {
          selectChat(chatId)
          setActivePrimaryId("new-chat")
        }}
      />

      {dialog ? (
        <EditDialog
          dialog={dialog}
          value={dialogValue}
          onValueChange={setDialogValue}
          onOpenChange={(open) => {
            if (!open) setDialog(null)
          }}
          onSubmit={submitDialog}
        />
      ) : null}
    </>
  )
}
