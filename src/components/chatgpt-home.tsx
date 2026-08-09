"use client"

import * as React from "react"
import { Mic } from "lucide-react"

import { ChatGptSidebarDemo } from "@/components/chatgpt-sidebar-demo"
import {
  SidebarInset,
  SidebarRoot,
  SidebarTrigger,
} from "@/components/sidebar"
import {
  ChatHistoryIcon,
  ChevronDownIcon,
  HamburgerMenuIcon,
  VoiceModeIcon,
} from "@/components/icons"

type NoticeHandler = (message: string) => void

function ChatModeSwitcher({ onNotice }: { onNotice: NoticeHandler }) {
  const [mode, setMode] = React.useState<"chat" | "work">("chat")

  return (
    <div className="flex h-10 items-center rounded-full bg-[#202020] p-0.5 text-[15px] text-[#b7b7b7]">
      <button
        type="button"
        aria-pressed={mode === "chat"}
        className={`h-9 min-w-[112px] rounded-full px-5 transition-colors ${mode === "chat" ? "bg-[#303030] text-white" : "hover:text-white"}`}
        onClick={() => setMode("chat")}
      >
        聊天
      </button>
      <button
        type="button"
        aria-pressed={mode === "work"}
        className={`h-9 min-w-[112px] rounded-full px-5 transition-colors ${mode === "work" ? "bg-[#303030] text-white" : "hover:text-white"}`}
        onClick={() => {
          setMode("work")
          onNotice("工作区模式已选中。")
        }}
      >
        工作
      </button>
    </div>
  )
}

function ChatHeader({ onNotice }: { onNotice: NoticeHandler }) {
  return (
    <header className="relative flex h-[59px] shrink-0 items-center justify-between px-2">
      <div className="flex items-center md:hidden">
        <SidebarTrigger tooltip="打开边栏" aria-label="打开边栏">
          <HamburgerMenuIcon className="size-5" />
        </SidebarTrigger>
      </div>
      <div className="pointer-events-none absolute inset-x-0 flex justify-center">
        <div className="pointer-events-auto">
          <ChatModeSwitcher onNotice={onNotice} />
        </div>
      </div>
      <button
        type="button"
        aria-label="打开通知"
        className="ml-auto flex size-10 items-center justify-center rounded-[9px] text-white transition-colors hover:bg-white/10"
        onClick={() => onNotice("通知中心已准备好。")}
      >
        <ChatHistoryIcon className="size-5" />
      </button>
    </header>
  )
}

function ChatComposer({ onNotice }: { onNotice: NoticeHandler }) {
  const [prompt, setPrompt] = React.useState("")
  const [recording, setRecording] = React.useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = prompt.trim()
    if (!value) return
    onNotice(`已提交：${value}`)
    setPrompt("")
  }

  return (
    <form
      className="flex h-[54px] w-full items-center gap-2 rounded-[28px] bg-[#2f2f2f] px-3.5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-shadow focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]"
      onSubmit={submit}
    >
      <button
        type="button"
        aria-label="添加文件等"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        onClick={() => onNotice("附件入口已准备好。")}
      >
        <span className="text-[27px] font-light leading-none">+</span>
      </button>
      <input
        aria-label="与 ChatGPT 聊天"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        placeholder="问问 ChatGPT"
        className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-white outline-none placeholder:text-[#b5b5b5]"
      />
      <button
        type="button"
        aria-label="选择模型"
        className="hidden h-9 items-center gap-1 rounded-full px-2 text-[15px] text-[#b5b5b5] transition-colors hover:bg-white/10 hover:text-white sm:flex"
        onClick={() => onNotice("当前模型：高。")}
      >
        高
        <ChevronDownIcon className="size-4" />
      </button>
      <button
        type="button"
        aria-label={recording ? "停止听写" : "开始听写"}
        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${recording ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
        onClick={() => {
          setRecording((value) => !value)
          onNotice(recording ? "听写已停止。" : "听写已开始。")
        }}
      >
        <Mic className="size-[19px]" />
      </button>
      <button
        type="button"
        aria-label="启动语音功能"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onNotice("语音功能已准备好。")}
      >
        <VoiceModeIcon className="size-6" />
      </button>
    </form>
  )
}

export type ChatGptHomeProps = {
  initialDark?: boolean
}

export function ChatGptHome({ initialDark = true }: ChatGptHomeProps) {
  const [notice, setNotice] = React.useState("")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", initialDark)
    document.documentElement.style.colorScheme = initialDark ? "dark" : "light"
  }, [initialDark])

  return (
    <SidebarRoot
      defaultOpen
      persistence={{ name: "chatgpt_sidebar_state" }}
    >
      <ChatGptSidebarDemo onNotice={setNotice} />
      <SidebarInset className="min-h-0 bg-black text-white">
        <ChatHeader onNotice={setNotice} />
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-[12vh]">
          <div className="relative flex w-full max-w-[865px] flex-col items-center">
            <div className="relative flex w-full justify-center">
              <h1 className="mb-8 text-center text-[30px] font-medium leading-9 tracking-[-0.025em] sm:text-[32px]">
                你今天在想些什么？
              </h1>
              <button
                type="button"
                className="absolute right-[-150px] top-0 hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3 text-[13px] text-[#e5e5e5] shadow-[0_4px_16px_rgba(0,0,0,0.24)] transition-colors hover:bg-[#202020] xl:flex"
                onClick={() => setNotice("AnyWorkflow 项目已选中。")}
              >
                <span className="size-2 rounded-full bg-[#767676]" />
                <span>Anyworkflow</span>
                <span className="text-[#999]">关闭</span>
                <span className="text-[17px] leading-none text-[#999]">+</span>
              </button>
            </div>
            <ChatComposer onNotice={setNotice} />
            <p className="mt-4 text-center text-xs text-[#8e8e8e]">
              ChatGPT 可能会犯错。请核查重要信息。{" "}
              <button
                type="button"
                className="underline underline-offset-2 hover:text-white"
                onClick={() => setNotice("已打开 ChatGPT 使用提示。")}
              >
                了解详情
              </button>
            </p>
            <p className="min-h-5 text-center text-xs text-[#8e8e8e]" aria-live="polite">
              {notice}
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarRoot>
  )
}
