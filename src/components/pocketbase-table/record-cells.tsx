"use client"

import { Check, Copy, Eye, Link2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export function RelationChip({
  children,
  muted = false,
}: {
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[220px] items-center gap-2 rounded-md bg-[#343434] px-2.5 py-1.5 text-[13px] text-white/85",
        muted && "text-white/45",
      )}
    >
      <Eye aria-hidden="true" className="size-3.5 shrink-0 text-white/45" />
      <span className="truncate">{children}</span>
    </span>
  )
}

export function RecordIdCell({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    await navigator.clipboard?.writeText(id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      aria-label={`Copy record id ${id}`}
      className="group/id inline-flex h-[25px] max-w-[146px] items-center gap-1 rounded-md bg-[#343434] px-1.5 py-1 text-left font-mono text-[12px] text-white/85 transition hover:bg-[#404040]"
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check className="size-3.5 text-[#7ee4b5]" /> : <Copy className="size-3.5 text-white/45" />}
      <span className="truncate">{id}</span>
    </button>
  )
}

export function RelationHeaderIcon() {
  return <Link2 aria-hidden="true" className="size-4 text-white/45" />
}

export function StatusChip({ status }: { status: string }) {
  const tone = status === "succeeded"
    ? "bg-emerald-400/12 text-emerald-300"
    : status === "failed"
      ? "bg-red-400/12 text-red-300"
      : "bg-amber-300/12 text-amber-200"

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px]", tone)}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function TableTextCell({
  children,
  mono = false,
}: {
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <span className={cn("block max-w-[270px] truncate text-white/70", mono && "font-mono text-xs")}>
      {children}
    </span>
  )
}

export function DateCell({ value }: { value: string }) {
  const [date, time] = value.split(" ")
  const isTimestamp = time !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(date)

  if (!isTimestamp) {
    return <span className="block whitespace-nowrap text-xs text-white/55">{value}</span>
  }

  return (
    <span className="block whitespace-nowrap text-xs text-white/55">
      {date}
      <span className="block text-white/35">{time}</span>
    </span>
  )
}
