"use client"

import { Download, RotateCcw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type BulkActionBarProps = {
  count: number
  onReset: () => void
  onDelete?: () => void
  onExport?: () => void
}

export function BulkActionBar({ count, onReset, onDelete, onExport }: BulkActionBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-200">
      <div
        aria-live="polite"
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/12 bg-[#202020]/95 px-3 py-2 text-sm text-white shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur"
      >
        <span className="px-2 text-white/85">
          Selected <strong className="font-semibold text-white">{count}</strong>{" "}
          {count === 1 ? "record" : "records"}
        </span>
        <Button
          className="h-8 rounded-full bg-white/10 px-3 text-white/85 hover:bg-white/16 hover:text-white"
          onClick={onReset}
          size="sm"
          type="button"
          variant="secondary"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
        {onDelete ? (
          <Button
            className="h-8 rounded-full border border-red-400/35 bg-transparent px-3 text-red-300 hover:bg-red-400/12 hover:text-red-200"
            onClick={onDelete}
            size="sm"
            type="button"
            variant="outline"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        ) : null}
        {onExport ? (
          <Button
            className="h-8 rounded-full bg-white/[0.08] px-3 text-white hover:bg-white/15"
            onClick={onExport}
            size="sm"
            type="button"
          >
            <Download className="size-3.5" />
            JSON
          </Button>
        ) : null}
      </div>
    </div>
  )
}
