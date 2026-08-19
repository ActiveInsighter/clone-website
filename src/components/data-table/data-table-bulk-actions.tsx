"use client"

import { LoaderCircle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { DataTableBulkAction, DataTableRecord } from "./types"

type DataTableBulkActionsProps<T extends DataTableRecord> = {
  count: number
  recordsLabel?: string
  recordLabel?: string
  actions: DataTableBulkAction<T>[]
  pendingActionId: string | null
  onRunAction: (action: DataTableBulkAction<T>) => void
  onReset: () => void
  className?: string
}

/**
 * Floating bulk action bar. It is an absolutely positioned overlay outside the
 * table scroll viewport, never a layout participant, so it stays anchored while
 * the table content scrolls and never shifts the table height when selection changes.
 */
export function DataTableBulkActions<T extends DataTableRecord>({
  count,
  recordsLabel = "records",
  recordLabel = recordsLabel.replace(/s$/, ""),
  actions,
  pendingActionId,
  onRunAction,
  onReset,
  className,
}: DataTableBulkActionsProps<T>) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-200",
        className,
      )}
    >
      <div
        aria-live="polite"
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-input bg-card/95 px-3 py-2 text-sm text-foreground shadow-xl backdrop-blur"
      >
        <span className="px-2 text-foreground/85">
          Selected{" "}
          <strong className="font-semibold text-foreground tabular-nums">
            {count}
          </strong>{" "}
          {count === 1 ? recordLabel : recordsLabel}
        </span>

        <Button
          className="h-8 rounded-full bg-foreground/10 px-3 text-foreground/85 hover:bg-foreground/15 hover:text-foreground"
          disabled={pendingActionId !== null}
          onClick={onReset}
          size="sm"
          type="button"
          variant="secondary"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>

        {actions.map((action) => {
          const isPending = pendingActionId === action.id

          return (
            <Button
              className={cn(
                "h-8 rounded-full px-3",
                action.destructive
                  ? "border border-destructive/40 bg-transparent text-destructive hover:bg-destructive/15 hover:text-destructive"
                  : "bg-foreground/10 text-foreground hover:bg-foreground/15",
              )}
              disabled={action.disabled || pendingActionId !== null}
              key={action.id}
              onClick={() => onRunAction(action)}
              size="sm"
              type="button"
              variant={action.destructive ? "outline" : "secondary"}
            >
              {isPending ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                action.icon
              )}
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
