"use client"

import * as React from "react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarFixedTop,
  SidebarFooter,
  SidebarHeader,
  SidebarIconButton,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarPanel,
  SidebarRail,
  SidebarRailButton,
  SidebarRailFooter,
  SidebarRailHeader,
  SidebarRailMenu,
  SidebarScrollArea,
  SidebarSection,
  SidebarSectionAction,
  SidebarSectionActions,
  SidebarSectionContent,
  SidebarSectionHeader,
  SidebarSectionTrigger,
  SidebarShell,
  SidebarShortcutHint,
  SidebarTrigger,
  useSidebar,
} from "@/components/sidebar"
import {
  chatGptSidebarNewChatItem,
  chatGptSidebarPrimaryItems,
  chatGptSidebarRailItems,
  chatGptSidebarUser,
} from "@/config/chatgpt-sidebar"
import {
  ArrowTopRightIcon,
  ChatGptLogoIcon,
  DownloadAppIcon,
  ImagesIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchChatsIcon,
  SidebarToggleIcon,
} from "@/components/icons"
import { ChatRow } from "./chat-row"
import { ProjectRow } from "./project-row"
import {
  EditDialog,
  getDialogValue,
  SearchDialog,
  type SidebarDialogState,
} from "./dialogs"
import {
  RailBrand,
  SidebarAccountMenu,
  UserAvatar,
  sidebarMenuClassName,
  type NoticeHandler,
} from "./account-menu"
import type {
  ChatGptSidebarChat,
  ChatGptSidebarSection,
} from "./model"
import {
  chatGptSidebarReducer,
  createChatGptSidebarState,
  flattenVisibleChatGroups,
  getVisibleChatGroups,
} from "./model"

function matchesQuery(value: string, query: string) {
  return !query || value.toLocaleLowerCase().includes(query)
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
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
  const { toggle } = useSidebar()
  const [state, dispatch] = React.useReducer(
    chatGptSidebarReducer,
    undefined,
    createChatGptSidebarState,
  )
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [dialog, setDialog] = React.useState<SidebarDialogState>(null)
  const [dialogValue, setDialogValue] = React.useState("")

  const query = state.searchQuery.trim().toLocaleLowerCase()
  const visibleProjects = state.projects
    .slice(0, state.showAllProjects ? state.projects.length : 5)
    .filter((project) => matchesQuery(project.name, query))
  const visibleChatGroups = getVisibleChatGroups(state.chats, query)
  const searchProjects = state.projects.filter((project) =>
    matchesQuery(project.name, query),
  )
  const searchChats = flattenVisibleChatGroups(visibleChatGroups)

  const announce = React.useCallback(
    (message: string) => onNotice(message),
    [onNotice],
  )

  const handleNewChat = React.useCallback(() => {
    onNewChat?.()
    announce("已准备好新聊天。")
  }, [announce, onNewChat])

  React.useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        !event.shiftKey ||
        (!event.ctrlKey && !event.metaKey) ||
        event.key.toLocaleLowerCase() !== "o" ||
        isEditableTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      handleNewChat()
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [handleNewChat])

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
        <RailBrand onClick={() => toggle()} />
      </SidebarRailHeader>
      <SidebarRailMenu>
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
      </SidebarRailMenu>
      <SidebarRailFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarRailButton aria-label="打开“个人资料”菜单">
                <UserAvatar compact />
              </SidebarRailButton>
            }
          />
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className={`w-[230px] ${sidebarMenuClassName()}`}
          >
            <SidebarAccountMenu onNotice={announce} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarRailFooter>
    </SidebarRail>
  )

  return (
    <>
      <SidebarShell side="left" label="历史聊天记录" rail={rail}>
        <SidebarPanel>
          <SidebarHeader className="px-[9px]">
            <Link
              href="/"
              aria-label="主页"
              className="flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-[9px] px-2.5 text-left text-[15px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
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

          <SidebarFixedTop>
            <SidebarMenu>
              <SidebarMenuItem active={!state.activeChatId && !state.activeProjectId}>
                <SidebarMenuButton
                  icon={<chatGptSidebarNewChatItem.icon />}
                  onClick={handleNewChat}
                >
                  {chatGptSidebarNewChatItem.label}
                  <SidebarShortcutHint keys={["Shift", "O"]} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFixedTop>

          <SidebarScrollArea>
            <SidebarMenu>
              {chatGptSidebarPrimaryItems.map((item) => {
                const Icon = item.icon
                if (item.kind === "route") {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        icon={<Icon />}
                      >
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.id}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <SidebarMenuButton icon={<Icon />}>
                            {item.label}
                          </SidebarMenuButton>
                        }
                      />
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={6}
                        className={`min-w-[150px] ${sidebarMenuClassName()}`}
                      >
                        <DropdownMenuItem onClick={() => announce("图片入口已准备好。")}>
                          <ImagesIcon />
                          图片
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => announce("站点入口已准备好。")}>
                          <ArrowTopRightIcon />
                          站点 <span className="ml-auto text-[10px] text-[#a8a8a8]">新</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => announce("GPT 入口已准备好。")}>
                          <ChatGptLogoIcon />
                          GPT
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>

            <SidebarSection
              open={state.expandedSections.pinned}
              onOpenChange={(open) => setSectionOpen("pinned", open)}
            >
              <SidebarSectionHeader>
                <SidebarSectionTrigger>已置顶</SidebarSectionTrigger>
              </SidebarSectionHeader>
              <SidebarSectionContent>
                <SidebarMenu>
                  {visibleChatGroups.pinned.length > 0 ? (
                    visibleChatGroups.pinned.map((chat) => (
                      <ChatRow
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
              </SidebarSectionContent>
            </SidebarSection>

            <SidebarSection
              open={state.expandedSections.projects}
              onOpenChange={(open) => setSectionOpen("projects", open)}
            >
              <SidebarSectionHeader>
                <SidebarSectionTrigger>项目</SidebarSectionTrigger>
                <SidebarSectionActions>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarSectionAction tooltip="整理项目" aria-label="整理项目">
                          <MoreHorizontalIcon />
                        </SidebarSectionAction>
                      }
                    />
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      sideOffset={6}
                      className={`min-w-[150px] ${sidebarMenuClassName()}`}
                    >
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
                </SidebarSectionActions>
              </SidebarSectionHeader>
              <SidebarSectionContent>
                <SidebarMenu>
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
              </SidebarSectionContent>
            </SidebarSection>

            <SidebarSection
              open={state.expandedSections.chats}
              onOpenChange={(open) => setSectionOpen("chats", open)}
            >
              <SidebarSectionHeader>
                <SidebarSectionTrigger>聊天</SidebarSectionTrigger>
                <SidebarSectionActions>
                  <SidebarSectionAction
                    tooltip="整理聊天"
                    aria-label="整理聊天"
                    onClick={() => announce("整理聊天入口已准备好。")}
                  >
                    <MoreHorizontalIcon />
                  </SidebarSectionAction>
                </SidebarSectionActions>
              </SidebarSectionHeader>
              <SidebarSectionContent>
                <SidebarMenu>
                  {visibleChatGroups.regular.map((chat) => (
                    <ChatRow
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
                  {visibleChatGroups.regular.length === 0 ? (
                    <li className="px-[18px] py-2 text-[13px] text-sidebar-muted-foreground">
                      没有匹配的聊天
                    </li>
                  ) : null}
                </SidebarMenu>
              </SidebarSectionContent>
            </SidebarSection>
          </SidebarScrollArea>

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
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={6}
                  className={`w-[230px] ${sidebarMenuClassName()}`}
                >
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
        </SidebarPanel>
      </SidebarShell>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={state.searchQuery}
        projects={searchProjects}
        chats={searchChats}
        onQueryChange={(queryValue) => dispatch({ type: "set-search", query: queryValue })}
        onSelectProject={selectProject}
        onSelectChat={selectChat}
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
