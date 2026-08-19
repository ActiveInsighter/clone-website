"use client"

import * as React from "react"
import { Folder, Network, Plus, Search, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const collections = [
  { name: "aw_clients", kind: "users" },
  { name: "aw_acts", kind: "folder" },
  { name: "aw_events", kind: "folder" },
  { name: "aw_logs", kind: "folder" },
  { name: "aw_messages", kind: "folder" },
  { name: "aw_tasks", kind: "folder" },
] as const

type PocketBaseSidebarProps = {
  activeCollection: string
  onSelectCollection: (name: string) => void
  onNewCollection?: () => void
}

function CollectionIcon({ kind }: { kind: (typeof collections)[number]["kind"] }) {
  return kind === "users" ? <Users className="size-5" /> : <Folder className="size-5" />
}

export function PocketBaseSidebar({
  activeCollection,
  onSelectCollection,
  onNewCollection,
}: PocketBaseSidebarProps) {
  const [search, setSearch] = React.useState("")
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLocaleLowerCase().includes(normalizedSearch),
  )

  return (
    <aside className="flex min-h-0 w-[240px] shrink-0 flex-col border-r border-white/8 bg-[#202020] text-white">
      <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            aria-label="Search collections"
            className="h-10 rounded-lg border-transparent bg-[#2b2b2b] pl-9 pr-8 text-sm text-white placeholder:text-white/40 focus-visible:border-white/15 focus-visible:ring-0"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search collections…"
            value={search}
          />
          {search ? (
            <button
              aria-label="Clear collection search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/35 hover:bg-white/10 hover:text-white"
              onClick={() => setSearch("")}
              type="button"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <Button aria-label="Collections overview" className="text-white/45 hover:bg-white/8 hover:text-white" size="icon-sm" type="button" variant="ghost">
          <Network className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 [scrollbar-color:#555_transparent]">
        <p className="px-3 text-[13px] font-semibold text-white/55">Collections</p>
        <nav aria-label="Collections" className="mt-3 space-y-1">
          {filteredCollections.map((collection) => {
            const active = collection.name === activeCollection
            return (
              <button
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-[15px] transition ${active ? "bg-white/[0.08] text-white" : "text-white/55 hover:bg-white/[0.05] hover:text-white/85"}`}
                key={collection.name}
                onClick={() => onSelectCollection(collection.name)}
                type="button"
              >
                <CollectionIcon kind={collection.kind} />
                <span className="truncate">{collection.name}</span>
              </button>
            )
          })}
        </nav>
        {!filteredCollections.length ? <p className="px-3 py-6 text-sm text-white/40">No collections found.</p> : null}
      </div>
      <div className="border-t border-white/8 p-3">
        <Button
          className="h-12 w-full justify-center border-white/15 bg-transparent text-[15px] font-semibold text-white/80 hover:bg-white/8 hover:text-white"
          onClick={onNewCollection}
          type="button"
          variant="outline"
        >
          <Plus className="size-5" />
          New collection
        </Button>
      </div>
    </aside>
  )
}
