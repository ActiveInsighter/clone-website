import type { FormEvent } from "react"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChatHistoryIcon,
  CloseIcon,
  FolderIcon,
  SearchChatsIcon,
} from "@/components/icons"
import type {
  ChatGptSidebarChat,
  ChatGptSidebarProject,
  ChatGptSidebarState,
} from "./model"

export type SidebarDialogState =
  | { kind: "create-project" }
  | { kind: "rename-project"; projectId: string }
  | { kind: "rename-chat"; chatId: string }
  | null

export function getDialogValue(
  dialog: Exclude<SidebarDialogState, null>,
  state: ChatGptSidebarState,
) {
  if (dialog.kind === "create-project") return ""
  if (dialog.kind === "rename-project") {
    return state.projects.find((project) => project.id === dialog.projectId)?.name ?? ""
  }
  return state.chats.find((chat) => chat.id === dialog.chatId)?.title ?? ""
}

export type SearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  projects: ChatGptSidebarProject[]
  chats: ChatGptSidebarChat[]
  onQueryChange: (query: string) => void
  onSelectProject: (projectId: string) => void
  onSelectChat: (chatId: string) => void
}

export function SearchDialog({
  open,
  onOpenChange,
  query,
  projects,
  chats,
  onQueryChange,
  onSelectProject,
  onSelectChat,
}: SearchDialogProps) {
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
                <Link
                  key={project.id}
                  href={`/g/${project.id}/project`}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    onSelectProject(project.id)
                    onOpenChange(false)
                  }}
                >
                  <FolderIcon className="size-4 text-[#bcbcbc]" />
                  <span className="truncate">{project.name}</span>
                  <span className="ml-auto text-xs text-[#777]">项目</span>
                </Link>
              ))}
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/c/${chat.id}`}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    onSelectChat(chat.id)
                    onOpenChange(false)
                  }}
                >
                  <ChatHistoryIcon className="size-4 text-[#bcbcbc]" />
                  <span className="truncate">{chat.title}</span>
                  <span className="ml-auto text-xs text-[#777]">聊天</span>
                </Link>
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

export type EditDialogProps = {
  dialog: Exclude<SidebarDialogState, null>
  value: string
  onValueChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function EditDialog({
  dialog,
  value,
  onValueChange,
  onOpenChange,
  onSubmit,
}: EditDialogProps) {
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
