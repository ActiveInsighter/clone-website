"use client"

import * as React from "react"
import { Code2, Plus, RefreshCw, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PocketBaseRecordSheet } from "@/components/pocketbase-record-sheet"
import {
  RecordIdCell,
  RelationChip,
  RelationHeaderIcon,
  DateCell,
  StatusChip,
  TableTextCell,
} from "@/components/pocketbase-table/record-cells"
import { pocketBaseRecords, type PocketBaseRecord } from "@/components/pocketbase-table/data"
import { SaasDataTable } from "@/components/pocketbase-table/saas-data-table"
import type { SaasColumnDef } from "@/components/pocketbase-table/types"

type PocketBaseCollectionsPageProps = {
  collectionName: string
}

export function PocketBaseCollectionsPage({
  collectionName,
}: PocketBaseCollectionsPageProps) {
  const [records, setRecords] = React.useState(pocketBaseRecords)
  const [activeRecord, setActiveRecord] = React.useState<PocketBaseRecord | null>(null)
  const [status, setStatus] = React.useState("Ready")

  const columns = React.useMemo<SaasColumnDef<PocketBaseRecord>[]>(
    () => [
      {
        accessorKey: "id",
        cell: ({ getValue }) => <RecordIdCell id={getValue<string>()} />,
        enableHiding: false,
        header: "id",
        meta: { className: "w-[172px] min-w-[172px]", label: "id", sortable: true },
      },
      {
        accessorKey: "owner",
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <RelationChip muted={value === "N/A"}>{value}</RelationChip>
        },
        header: () => <span className="inline-flex items-center gap-2"><RelationHeaderIcon /> owner</span>,
        meta: { className: "w-[190px] min-w-[190px]", label: "owner", sortable: true },
      },
      {
        accessorKey: "task",
        cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
        header: () => <span className="inline-flex items-center gap-2"><RelationHeaderIcon /> task</span>,
        meta: { className: "w-[190px] min-w-[190px]", label: "task", sortable: true },
      },
      {
        accessorKey: "event",
        cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
        header: () => <span className="inline-flex items-center gap-2"><RelationHeaderIcon /> event</span>,
        meta: { className: "w-[190px] min-w-[190px]", label: "event", sortable: true },
      },
      {
        accessorKey: "act",
        cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
        header: () => <span className="inline-flex items-center gap-2"><RelationHeaderIcon /> act</span>,
        meta: { className: "w-[190px] min-w-[190px]", label: "act", sortable: true },
      },
      {
        accessorKey: "nodeIndex",
        cell: ({ getValue }) => <span className="font-mono text-white/80">{getValue<number>()}</span>,
        header: () => <span className="inline-flex items-center gap-2"><span className="text-white/55">#</span> nodeIndex</span>,
        meta: { className: "w-[144px] min-w-[144px]", label: "nodeIndex", sortable: true },
      },
      {
        accessorKey: "attempt",
        cell: ({ getValue }) => <span className="font-mono text-white/75">{getValue<number>()}</span>,
        header: "attempt",
        meta: { className: "w-[126px] min-w-[126px]", label: "attempt", sortable: true },
      },
      {
        accessorKey: "status",
        cell: ({ getValue }) => <StatusChip status={getValue<string>()} />,
        header: "status",
        meta: { className: "w-[180px] min-w-[180px]", label: "status", sortable: true },
      },
      {
        accessorKey: "userMarkdown",
        cell: ({ getValue }) => <TableTextCell>{getValue<string>()}</TableTextCell>,
        header: "userMarkdown",
        meta: { className: "w-[298px] min-w-[298px]", label: "userMarkdown", sortable: true },
      },
      {
        accessorKey: "assistantMarkdown",
        cell: ({ getValue }) => <TableTextCell>{getValue<string>()}</TableTextCell>,
        header: "assistantMarkdown",
        meta: { className: "w-[298px] min-w-[298px]", label: "assistantMarkdown", sortable: true },
      },
      {
        accessorKey: "conversationUrl",
        cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
        header: "conversationUrl",
        meta: { className: "w-[298px] min-w-[298px]", label: "conversationUrl", sortable: true },
      },
      {
        accessorKey: "sentAt",
        cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
        header: "sentAt",
        meta: { className: "w-[117px] min-w-[117px]", label: "sentAt", sortable: true },
      },
      {
        accessorKey: "receivedAt",
        cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
        header: "receivedAt",
        meta: { className: "w-[144px] min-w-[144px]", label: "receivedAt", sortable: true },
      },
      {
        accessorKey: "captureMeta",
        cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
        header: "captureMeta",
        meta: { className: "w-[298px] min-w-[298px]", label: "captureMeta", sortable: true },
      },
      {
        accessorKey: "checksum",
        cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
        header: "checksum",
        meta: { className: "w-[298px] min-w-[298px]", label: "checksum", sortable: true },
      },
      {
        accessorKey: "created",
        cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
        header: "created",
        meta: { className: "w-[123px] min-w-[123px]", label: "created", sortable: true },
      },
      {
        accessorKey: "updated",
        cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
        header: "updated",
        meta: { className: "w-[128px] min-w-[128px]", label: "updated", sortable: true },
      },
    ],
    [],
  )

  const newRecord = () => {
    const record: PocketBaseRecord = {
      id: `new${Math.random().toString(36).slice(2, 14)}`,
      owner: "N/A",
      task: "未命名任务",
      event: "Act 1",
      act: "Act 1",
      nodeIndex: 0,
      attempt: 1,
      status: "pending",
      userMarkdown: "",
      assistantMarkdown: "",
      conversationUrl: "",
      sentAt: "just now",
      receivedAt: "—",
      captureMeta: "{}",
      checksum: "—",
      created: "just now",
      updated: "just now",
    }
    setRecords((current) => [record, ...current])
    setActiveRecord(record)
  }

  const saveRecord = (record: PocketBaseRecord) => {
    setRecords((current) => current.map((item) => (item.id === record.id ? record : item)))
    setStatus("Changes saved")
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#191919] text-white">
      <header className="mx-[30px] mt-5 mb-5 flex h-[45px] shrink-0 items-center justify-between gap-4 max-[700px]:mx-5 max-[700px]:mt-5 max-[700px]:mb-4 max-[700px]:h-auto max-[700px]:min-h-[45px] max-[700px]:flex-wrap">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex items-center gap-3 text-[27px] tracking-[-0.035em] text-white/60">
            <span>Collections</span>
            <span aria-hidden="true" className="text-white/25">/</span>
            <strong className="truncate font-medium text-white">{collectionName}</strong>
          </div>
          <Button aria-label="Collection settings" className="text-white/55 hover:bg-white/8 hover:text-white" size="icon-sm" type="button" variant="ghost">
            <Settings2 className="size-5" />
          </Button>
          <Button aria-label="Refresh records" className="text-white/55 hover:bg-white/8 hover:text-white" onClick={() => setStatus("Records refreshed")} size="icon-sm" type="button" variant="ghost">
            <RefreshCw className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 border-white/15 bg-transparent px-5 text-white hover:bg-white/8" onClick={() => setStatus("API preview ready")} type="button" variant="outline">
            <Code2 className="size-4" />
            <span className="hidden sm:inline">API preview</span>
          </Button>
          <Button className="h-10 bg-[#0d0d0d] px-5 text-white hover:bg-[#303030]" onClick={newRecord} type="button">
            <Plus className="size-4" />
            New record
          </Button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">
        <SaasDataTable
          columns={columns}
          data={records}
          emptyDescription="No records match this filter."
          onCreate={newRecord}
          onDeleteSelected={(selected) => {
            const selectedIds = new Set(selected.map((record) => record.id))
            setRecords((current) => current.filter((record) => !selectedIds.has(record.id)))
            setStatus(`${selected.length} record${selected.length === 1 ? "" : "s"} deleted`)
          }}
          onRowClick={setActiveRecord}
          searchPlaceholder="Search term or filter…"
        />
      </div>
      <footer className="flex shrink-0 items-center justify-between border-t border-white/8 px-[30px] py-[10px] text-sm text-white/40 max-[700px]:px-5">
        <span className={status === "Ready" ? "" : "text-[#7ee4b5]"}>{status}</span>
        <span>Total: {records.length}</span>
      </footer>
      <PocketBaseRecordSheet
        onOpenChange={(open) => {
          if (!open) setActiveRecord(null)
        }}
        onSave={saveRecord}
        record={activeRecord}
      />
    </main>
  )
}
