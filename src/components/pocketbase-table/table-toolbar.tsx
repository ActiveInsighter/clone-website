"use client"

import { Columns3, Search } from "lucide-react"
import type { IdentifiableRecord, SaasColumnMeta, TableToolbarProps } from "./types"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function TableToolbar<T extends IdentifiableRecord>({
  table,
  search,
  onSearchChange,
  placeholder,
}: TableToolbarProps<T>) {
  const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide())

  return (
    <div className="mx-[30px] flex flex-wrap items-center gap-3 pb-5 max-[700px]:mx-5">
      <label className="relative min-w-[220px] flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45"
        />
        <Input
          aria-label="Search records"
          className="h-[45px] rounded-full border-white/8 bg-[#292929] pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus-visible:border-white/20 focus-visible:ring-0"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={search}
        />
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Toggle columns"
          className="flex h-9 items-center gap-2 rounded-md border border-white/12 bg-transparent px-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
          type="button"
        >
          <Columns3 className="size-4" />
          <span className="hidden sm:inline">Columns</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[190px] border-white/10 bg-[#292929] text-white"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-white/45">
              Visible fields
            </DropdownMenuLabel>
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="text-white/75 focus:bg-white/10 focus:text-white"
                key={column.id}
                onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
              >
                {(column.columnDef.meta as SaasColumnMeta | undefined)?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/10" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
