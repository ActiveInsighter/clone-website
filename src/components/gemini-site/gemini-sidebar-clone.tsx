"use client"

import * as React from "react"
import { ArrowUpRight, Mic, Plus } from "lucide-react"

import {
  ConfiguredSidebar,
  ConfiguredSidebarMobileTrigger,
} from "@/components/sidebar/configured-sidebar"
import { SidebarInset, SidebarRoot } from "@/components/sidebar"
import { geminiSidebarConfig } from "@/components/gemini-site/gemini-sidebar-data"

import "./gemini-sidebar-clone.css"

const pageItems = [
  ["研究", "把复杂问题拆成可执行的下一步。"],
  ["写作", "在同一个安静的工作区里整理灵感。"],
  ["代码", "从侧边栏快速回到最近的上下文。"],
] as const

export function GeminiSidebarClone() {
  const [activeItemId, setActiveItemId] = React.useState("new-chat")
  const [notice, setNotice] = React.useState("")

  const handleSelect = (item: { id: string; label: string }) => {
    setActiveItemId(item.id)
    setNotice(`${item.label}已选中`)
  }

  return (
    <div className="gemini-page">
      <SidebarRoot
        className="gemini-shell"
        defaultOpen
        persistence={false}
        tokens={{
          "--sidebar-width": "288px",
          "--sidebar-rail-width": "52px",
          "--sidebar-header-height": "52px",
          "--sidebar-item-height": "32px",
          "--sidebar-icon-button-size": "36px",
          "--sidebar-icon-size": "20px",
          "--sidebar-action-size": "32px",
          "--sidebar-inline-margin": "6px",
          "--sidebar-inline-padding": "8px",
          "--sidebar-item-radius": "9999px",
          "--sidebar-section-gap": "12px",
          "--sidebar-font-size": "15px",
          "--sidebar-line-height": "20px",
          "--sidebar-scrollbar-size": "8px",
          "--sidebar-scrollbar-gutter": "6px",
          "--sidebar-motion-duration": "300ms",
          "--sidebar-motion-fast-duration": "150ms",
          "--sidebar-motion-easing": "cubic-bezier(0.2, 0, 0, 1)",
          "--sidebar-surface": "#1f1f1f",
          "--sidebar-foreground": "#e6e6e6",
          "--sidebar-muted-foreground": "rgba(255, 255, 255, 0.55)",
          "--sidebar-row-highlight": "rgba(255, 255, 255, 0.08)",
          "--sidebar-border": "transparent",
          "--sidebar-border-strong": "transparent",
          "--sidebar-focus-ring": "#8ab4f8",
          "--sidebar-overlay": "rgba(0, 0, 0, 0.55)",
          "--sidebar-shadow": "0 12px 40px rgba(0, 0, 0, 0.42)",
        }}
      >
        <ConfiguredSidebar
          activeItemId={activeItemId}
          config={geminiSidebarConfig}
          onSelect={handleSelect}
        />
        <SidebarInset className="gemini-main">
          <header className="gemini-topbar">
            <ConfiguredSidebarMobileTrigger label={geminiSidebarConfig.openLabel} />
            <div className="gemini-topbar-spacer" />
            <button className="gemini-upgrade" onClick={() => setNotice("升级入口已选中")} type="button">
              <span aria-hidden="true">✦</span>
              升级
            </button>
            <button aria-label="临时对话" className="gemini-temporary" onClick={() => setNotice("临时对话已选中")} type="button">
              ◌
            </button>
          </header>

          <main className="gemini-content">
            <div aria-live="polite" className="sr-only">{notice}</div>
            <section className="gemini-hero" aria-labelledby="gemini-greeting">
              <p className="gemini-eyebrow">与 Gemini 对话</p>
              <h1 id="gemini-greeting">Tom，想了解什么，尽管问吧！</h1>
              <div className="gemini-composer">
                <button aria-label="上传和工具" className="gemini-composer-icon" onClick={() => setNotice("上传和工具已选中")} type="button"><Plus /></button>
                <span>问问 Gemini</span>
                <div className="gemini-composer-actions">
                  <button className="gemini-mode" onClick={() => setNotice("当前模式：Pro")} type="button">Pro <span aria-hidden="true">⌄</span></button>
                  <button aria-label="语音输入" className="gemini-composer-icon" onClick={() => setNotice("语音输入已选中")} type="button"><Mic /></button>
                </div>
              </div>
            </section>

            <section aria-label="Gemini 功能预览" className="gemini-preview-grid">
              {pageItems.map(([title, description]) => (
                <article className="gemini-preview-card" key={title}>
                  <span className="gemini-preview-number">0{pageItems.findIndex(([itemTitle]) => itemTitle === title) + 1}</span>
                  <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </article>
              ))}
            </section>
          </main>
        </SidebarInset>
      </SidebarRoot>
    </div>
  )
}
