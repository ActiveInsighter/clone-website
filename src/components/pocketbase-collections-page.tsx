"use client"

import * as React from "react"
import {
  Code2,
  Download,
  EllipsisVertical,
  Plus,
  RefreshCw,
  Settings2,
  Trash2,
} from "lucide-react"

import {
  DataTable,
  downloadRecordsJson,
  type DataTableBulkAction,
  type DataTableClassNames,
} from "@/components/data-table"
import { PocketBaseRecordSheet } from "@/components/pocketbase-record-sheet"
import { pocketBaseRecordColumns } from "@/components/pocketbase-table/columns"
import {
  pocketBaseRecords,
  type PocketBaseRecord,
} from "@/components/pocketbase-table/data"
import { Button } from "@/components/ui/button"

type PocketBaseCollectionsPageProps = {
  collectionName: string
}

/**
 * PocketBase skin for the reusable DataTable: structural overrides only.
 * Colors come from the `.pocketbase-table-skin` token scope in globals.css.
 */
const tableClassNames: DataTableClassNames = {
  toolbar:
    "mx-[30px] border-b-0 bg-transparent px-0 py-0 pb-5 max-[700px]:mx-5",
  searchInput:
    "h-[45px] rounded-full border-border bg-secondary pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus-visible:border-foreground/20 focus-visible:ring-0",
  table: "min-w-[970px]",
  headerCell: "h-[45px]",
  selectionHeaderCell: "w-[62px] min-w-[62px] pl-[30px] pr-[5px]",
  selectionCell: "w-[62px] min-w-[62px] pl-[30px] pr-[5px]",
  rowActionsHeaderCell: "w-[75px] min-w-[75px] px-4",
  rowActionsCell: "w-[75px] min-w-[75px] px-4",
  cell: "h-[59px] px-4 text-[13px]",
  pagination: "px-[30px] max-[700px]:px-5",
}

export function PocketBaseCollectionsPage({
  collectionName,
}: PocketBaseCollectionsPageProps) {
  const [records, setRecords] = React.useState(pocketBaseRecords)
  const [activeRecord, setActiveRecord] = React.useState<PocketBaseRecord | null>(null)
  const [status, setStatus] = React.useState("Ready")

  const bulkActions: DataTableBulkAction<PocketBaseRecord>[] = [
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="size-3.5" />,
      destructive: true,
      action: deleteRecords,
    },
    {
      id: "export",
      label: "JSON",
      icon: <Download className="size-3.5" />,
      keepSelection: true,
      action: (selected) => downloadRecordsJson(selected, "selected-records"),
    },
  ]

  function newRecord() {
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

  function saveRecord(record: PocketBaseRecord) {
    setRecords((current) => current.map((item) => (item.id === record.id ? record : item)))
    setStatus("Changes saved")
  }

  function deleteRecords(selected: PocketBaseRecord[]) {
    const selectedIds = new Set(selected.map((record) => record.id))
    setRecords((current) => current.filter((record) => !selectedIds.has(record.id)))
    setStatus(`${selected.length} record${selected.length === 1 ? "" : "s"} deleted`)
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#191919] text-white">
      <header className="mx-[30px] mt-5 mb-5 flex h-[45px] shrink-0 items-center justify-between gap-4 max-[700px]:mx-5 max-[700px]:mt-5 max-[700px]:mb-4 max-[700px]:h-auto max-[700px]:min-h-[45px] max-[700px]:flex-wrap">
        <div className="flex min-w-0 items-center gap-4 max-[360px]:w-full max-[360px]:gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-3 text-[27px] tracking-[-0.035em] text-white/60 max-[360px]:gap-2 max-[360px]:text-[24px]">
            <span className="shrink-0">Collections</span>
            <span aria-hidden="true" className="shrink-0 text-white/25">/</span>
            <strong className="min-w-0 truncate font-medium text-white">{collectionName}</strong>
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
        <DataTable
          bulkActions={bulkActions}
          className="pocketbase-table-skin"
          classNames={tableClassNames}
          columns={pocketBaseRecordColumns}
          data={records}
          emptyDescription="No records match this filter."
          initialPageSize={8}
          onBulkActionError={() => setStatus("Bulk action failed")}
          onCreate={newRecord}
          onRowClick={setActiveRecord}
          rowActionsHeaderIcon={
            <EllipsisVertical aria-hidden="true" className="ml-auto size-4" />
          }
          searchPlaceholder="Search term or filter…"
        />
      </div>
      <footer className="flex shrink-0 items-center justify-between border-t border-white/8 px-[30px] py-[10px] text-sm text-white/40 max-[700px]:px-5">
        <span className={status === "Ready" ? "" : "text-[#7ee4b5]"}>{status}</span>
        <span>Total: {records.length}</span>
      </footer>
      <PocketBaseRecordSheet
        collectionName={collectionName}
        onOpenChange={(open) => {
          if (!open) setActiveRecord(null)
        }}
        onSave={saveRecord}
        record={activeRecord}
      />
    </main>
  )
}
