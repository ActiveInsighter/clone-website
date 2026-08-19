"use client"

import * as React from "react"
import { Columns3, Search } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type {
  DataTableClassNames,
  DataTableColumnMeta,
  DataTableInstance,
  DataTableRecord,
} from "./types"

type DataTableToolbarProps<T extends DataTableRecord> = {
  table: DataTableInstance<T>
  search: string
  onSearchChange: (value: string) => void
  placeholder: string
  showSearch: boolean
  showColumnVisibility: boolean
  toolbarActions?: React.ReactNode
  classNames?: DataTableClassNames
}

export function DataTableToolbar<T extends DataTableRecord>({
  table,
  search,
  onSearchChange,
  placeholder,
  showSearch,
  showColumnVisibility,
  toolbarActions,
  classNames,
}: DataTableToolbarProps<T>) {
  // Portaling the columns menu into the toolbar keeps it inside the table's
  // CSS variable scope, so themed skins style the dropdown too.
  const menuContainerRef = React.useRef<HTMLDivElement | null>(null)
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  if (!showSearch && !showColumnVisibility && !toolbarActions) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3",
        classNames?.toolbar,
      )}
      ref={menuContainerRef}
    >
      {showSearch ? (
        <label className="relative min-w-[220px] flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/90"
          />
          <Input
            aria-label="Search records"
            className={cn("pl-9 pr-4", classNames?.searchInput)}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            type="search"
            value={search}
          />
        </label>
      ) : null}

      <div className={cn("flex items-center gap-2", showSearch && "ml-auto")}>
        {toolbarActions}

        {showColumnVisibility && hideableColumns.length ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Toggle columns"
              className="flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
            >
              <Columns3 className="size-4" />
              <span className="hidden sm:inline">Columns</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn("min-w-[190px]", classNames?.columnsMenu)}
              container={menuContainerRef}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                  Visible fields
                </DropdownMenuLabel>
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="focus:bg-foreground/10 focus:text-foreground"
                    key={column.id}
                    onCheckedChange={(checked) =>
                      column.toggleVisibility(!!checked)
                    }
                  >
                    {
                      (column.columnDef.meta as DataTableColumnMeta | undefined)
                        ?.label ?? column.id
                    }
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  )
}
