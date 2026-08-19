"use client"

import * as React from "react"
import { Eye, KeyRound, MoreHorizontal, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { PocketBaseRecord } from "@/components/pocketbase-table/data"

type PocketBaseRecordSheetProps = {
  record: PocketBaseRecord | null
  onOpenChange: (open: boolean) => void
  onSave: (record: PocketBaseRecord) => void
}

type RelationKey = "owner" | "task" | "event" | "act"

const relationOptions: Record<RelationKey, string[]> = {
  owner: ["N/A", "Acme", "Orbit"],
  task: ["未命名任务", "客户同步", "发送事件", "通知审批人"],
  event: ["Act 1", "Act 2", "Act 3", "Act 4"],
  act: ["Act 1", "Act 2", "Act 3", "Act 4"],
}

function RelationField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: RelationKey
  value: string
  onChange: (value: string) => void
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false)

  return (
    <div className="overflow-hidden rounded-[9px] border border-white/6 bg-[#2b2b2b]">
      <div className="flex items-center gap-2 border-b border-white/7 px-5 py-4 text-[15px] font-semibold text-white/75">
        <Sparkles className="size-4 text-white/45" />
        <span>{label}</span>
        <span className="text-[#f36b76]">*</span>
      </div>
      <div className="flex min-h-[72px] items-center gap-2 px-5 py-4">
        <span className="inline-flex min-w-0 items-center gap-2 rounded-md bg-white/[0.06] px-3 py-2 text-sm text-white/75">
          <Eye className="size-4 text-white/45" />
          <span className="truncate">{value}</span>
        </span>
        <button
          aria-label={`Clear ${label}`}
          className="ml-auto rounded p-1 text-lg leading-none text-white/35 transition hover:bg-white/10 hover:text-white/80"
          onClick={() => onChange("N/A")}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="border-t border-white/7 px-5 py-4">
        <Button
          className="w-full justify-center text-white/80 hover:bg-white/8 hover:text-white"
          onClick={() => setPickerOpen((open) => !open)}
          type="button"
          variant="ghost"
        >
          <Sparkles className="size-4" />
          {pickerOpen ? "Close records picker" : "Open records picker"}
        </Button>
        {pickerOpen ? (
          <div className="mt-2 grid gap-1 rounded-md border border-white/8 bg-[#202020] p-1">
            {relationOptions[name].map((option) => (
              <button
                className="rounded px-3 py-2 text-left text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
                key={option}
                onClick={() => {
                  onChange(option)
                  setPickerOpen(false)
                }}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function FieldCard({
  label,
  value,
  onChange,
  multiline = false,
  mono = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  mono?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-[9px] border border-white/6 bg-[#2b2b2b]">
      <label className="block border-b border-white/7 px-5 py-4 text-[15px] font-semibold text-white/75">
        {label}
        <span className="ml-1 text-[#f36b76]">*</span>
      </label>
      <div className="px-5 py-4">
        {multiline ? (
          <Textarea
            className={`min-h-[96px] resize-y border-white/8 bg-[#202020] text-sm text-white/80 focus-visible:border-white/20 focus-visible:ring-0 ${mono ? "font-mono text-xs" : ""}`}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          />
        ) : (
          <Input
            className={`border-white/8 bg-[#202020] text-sm text-white/80 focus-visible:border-white/20 focus-visible:ring-0 ${mono ? "font-mono text-xs" : ""}`}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          />
        )}
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="overflow-hidden rounded-[9px] border border-white/6 bg-[#2b2b2b]">
      <label className="block border-b border-white/7 px-5 py-4 text-[15px] font-semibold text-white/75">{label}</label>
      <div className="px-5 py-4">
        <Input
          className="border-white/8 bg-[#202020] font-mono text-sm text-white/80 focus-visible:border-white/20 focus-visible:ring-0"
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          type="number"
          value={value}
        />
      </div>
    </div>
  )
}

function StatusField({
  value,
  onChange,
}: {
  value: PocketBaseRecord["status"]
  onChange: (value: PocketBaseRecord["status"]) => void
}) {
  return (
    <div className="overflow-hidden rounded-[9px] border border-white/6 bg-[#2b2b2b]">
      <label className="block border-b border-white/7 px-5 py-4 text-[15px] font-semibold text-white/75">
        status <span className="ml-1 text-[#f36b76]">*</span>
      </label>
      <div className="px-5 py-4">
        <select
          aria-label="status"
          className="h-9 w-full rounded-md border border-white/8 bg-[#202020] px-3 text-sm text-white/80 outline-none focus:border-white/20"
          onChange={(event) => onChange(event.target.value as PocketBaseRecord["status"])}
          value={value}
        >
          <option value="succeeded">succeeded</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
        </select>
      </div>
    </div>
  )
}

export function PocketBaseRecordSheet({ record, onOpenChange, onSave }: PocketBaseRecordSheetProps) {
  const [draft, setDraft] = React.useState<PocketBaseRecord | null>(record)

  React.useEffect(() => {
    setDraft(record)
  }, [record])

  const updateRelation = (key: RelationKey, value: string) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  const updateField = <K extends keyof PocketBaseRecord>(key: K, value: PocketBaseRecord[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  return (
    <Sheet open={!!record} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[min(620px,100vw)] gap-0 border-white/8 bg-[#1d1d1d] p-0 text-white shadow-[-16px_0_40px_rgba(0,0,0,0.24)] sm:max-w-[620px]"
        overlayClassName="bg-black/70 backdrop-blur-[1px]"
        showCloseButton={false}
        side="right"
      >
        <SheetHeader className="flex h-[86px] shrink-0 flex-row items-center justify-between border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-[24px] font-normal tracking-[-0.03em] text-white">
            Edit <strong className="font-semibold">aw_messages</strong> record
          </SheetTitle>
          <Button aria-label="More record actions" className="text-white/60 hover:bg-white/8 hover:text-white" size="icon-sm" type="button" variant="ghost">
            <MoreHorizontal className="size-5" />
          </Button>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 [scrollbar-color:#555_transparent]">
          {draft ? (
            <>
              <div className="rounded-[9px] border border-white/6 bg-[#2b2b2b] px-5 py-4">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-white/70">
                  <KeyRound aria-hidden="true" className="size-4 text-white/45" />
                  id
                </p>
                <p className="mt-4 font-mono text-sm text-white/55">{draft.id}</p>
              </div>
              <RelationField label="owner" name="owner" onChange={(value) => updateRelation("owner", value)} value={draft.owner} />
              <RelationField label="task" name="task" onChange={(value) => updateRelation("task", value)} value={draft.task} />
              <RelationField label="event" name="event" onChange={(value) => updateRelation("event", value)} value={draft.event} />
              <RelationField label="act" name="act" onChange={(value) => updateRelation("act", value)} value={draft.act} />
              <div className="rounded-[9px] border border-white/6 bg-[#2b2b2b] px-5 py-4">
                <p className="text-[15px] font-semibold text-white/70"># nodeIndex</p>
                <div className="mt-4">
                  <Input
                    className="border-white/8 bg-[#202020] font-mono text-sm text-white/80 focus-visible:border-white/20 focus-visible:ring-0"
                    min={0}
                    onChange={(event) => updateField("nodeIndex", Number(event.target.value))}
                    type="number"
                    value={draft.nodeIndex}
                  />
                </div>
              </div>
              <NumberField label="attempt" onChange={(value) => updateField("attempt", value)} value={draft.attempt} />
              <StatusField onChange={(value) => updateField("status", value)} value={draft.status} />
              <FieldCard label="userMarkdown" multiline onChange={(value) => updateField("userMarkdown", value)} value={draft.userMarkdown} />
              <FieldCard label="assistantMarkdown" multiline onChange={(value) => updateField("assistantMarkdown", value)} value={draft.assistantMarkdown} />
              <FieldCard label="conversationUrl" onChange={(value) => updateField("conversationUrl", value)} value={draft.conversationUrl} />
              <FieldCard label="sentAt" onChange={(value) => updateField("sentAt", value)} value={draft.sentAt} />
              <FieldCard label="receivedAt" onChange={(value) => updateField("receivedAt", value)} value={draft.receivedAt} />
              <FieldCard label="captureMeta" mono multiline onChange={(value) => updateField("captureMeta", value)} value={draft.captureMeta} />
              <FieldCard label="checksum" mono multiline onChange={(value) => updateField("checksum", value)} value={draft.checksum} />
              <FieldCard label="created" onChange={(value) => updateField("created", value)} value={draft.created} />
              <FieldCard label="updated" onChange={(value) => updateField("updated", value)} value={draft.updated} />
            </>
          ) : null}
        </div>
        <SheetFooter className="flex shrink-0 flex-row items-center justify-between border-t border-white/8 bg-[#1d1d1d] px-6 py-5">
          <Button className="px-0 text-white hover:bg-transparent hover:text-white/70" onClick={() => onOpenChange(false)} type="button" variant="ghost">
            Close
          </Button>
          <Button
            className="min-w-[170px] bg-[#2a2a2a] text-white/45 hover:bg-[#343434] hover:text-white"
            disabled={!draft}
            onClick={() => {
              if (draft) onSave(draft)
              onOpenChange(false)
            }}
            type="button"
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
