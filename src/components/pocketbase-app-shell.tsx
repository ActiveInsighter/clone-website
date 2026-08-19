"use client"

import * as React from "react"
import { BarChart3, ChevronDown, Database, Menu, Moon, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { PocketBaseCollectionsPage } from "@/components/pocketbase-collections-page"
import { PocketBaseSidebar } from "@/components/pocketbase-sidebar"

export function PocketBaseAppShell() {
  const [activeCollection, setActiveCollection] = React.useState("aw_messages")
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("Collections")

  return (
    <div className="pocketbase-page flex min-h-screen flex-col bg-[#191919] text-white">
      <header className="flex h-[38px] shrink-0 items-center justify-between bg-[#1055c9] px-3 text-white">
        <div className="flex items-center gap-2">
          <Button aria-label="Open collections" className="mr-1 text-white/85 hover:bg-white/10 lg:hidden" onClick={() => setMobileSidebarOpen(true)} size="icon-sm" type="button" variant="ghost">
            <Menu className="size-5" />
          </Button>
          <div aria-label="PocketBase" className="relative flex size-6 items-center justify-center rounded-[3px] bg-white text-[#1055c9]" role="img">
            <span className="absolute left-[3px] top-[3px] text-[9px] font-black leading-none">P</span>
            <span className="absolute bottom-[3px] right-[3px] text-[9px] font-black leading-none">B</span>
          </div>
          <nav aria-label="Admin sections" className="ml-2 flex items-center gap-1">
            {[
              { label: "Collections", icon: Database },
              { label: "Logs", icon: BarChart3 },
              { label: "Settings", icon: Settings2 },
            ].map(({ label, icon: Icon }) => {
              const active = activeSection === label
              return (
                <button
                  aria-current={active ? "page" : undefined}
                  className={`flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-semibold transition ${active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
                  key={label}
                  onClick={() => setActiveSection(label)}
                  type="button"
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button aria-label="Switch theme" className="text-white/70 hover:bg-white/10 hover:text-white" size="icon-sm" type="button" variant="ghost">
            <Moon className="size-4" />
          </Button>
          <Button className="gap-1 px-2 text-[13px] text-white/75 hover:bg-white/10 hover:text-white" type="button" variant="ghost">
            <span className="hidden sm:inline">2212148739@qq.com</span>
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="hidden min-h-0 lg:flex">
          <PocketBaseSidebar
            activeCollection={activeCollection}
            onNewCollection={() => undefined}
            onSelectCollection={setActiveCollection}
          />
        </div>
        <Sheet onOpenChange={setMobileSidebarOpen} open={mobileSidebarOpen}>
          <SheetContent className="w-[min(90vw,330px)] border-white/8 bg-[#202020] p-0 text-white" side="left">
            <SheetTitle className="sr-only">Collections</SheetTitle>
            <PocketBaseSidebar
              activeCollection={activeCollection}
              onNewCollection={() => setMobileSidebarOpen(false)}
              onSelectCollection={(name) => {
                setActiveCollection(name)
                setMobileSidebarOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
        {activeSection === "Collections" ? (
          <PocketBaseCollectionsPage collectionName={activeCollection} />
        ) : (
          <main className="flex flex-1 items-center justify-center bg-[#191919] text-white/40">
            {activeSection} is not part of this table-focused clone.
          </main>
        )}
      </div>
    </div>
  )
}
