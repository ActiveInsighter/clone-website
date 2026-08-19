import type { DataTableColumnDef } from "@/components/data-table"

import type { PocketBaseRecord } from "./data"
import {
  DateCell,
  RecordIdCell,
  RelationChip,
  RelationHeaderIcon,
  StatusChip,
  TableTextCell,
} from "./record-cells"

export const pocketBaseRecordColumns: DataTableColumnDef<PocketBaseRecord>[] = [
  {
    accessorKey: "id",
    cell: ({ getValue }) => <RecordIdCell id={getValue<string>()} />,
    enableHiding: false,
    header: "id",
    meta: { label: "id", widthClassName: "w-[172px] min-w-[172px] max-w-[172px]" },
  },
  {
    accessorKey: "owner",
    cell: ({ getValue }) => {
      const value = getValue<string>()
      return <RelationChip muted={value === "N/A"}>{value}</RelationChip>
    },
    header: "owner",
    meta: { icon: <RelationHeaderIcon />, label: "owner", widthClassName: "w-[190px] min-w-[190px] max-w-[190px]" },
  },
  {
    accessorKey: "task",
    cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
    header: "task",
    meta: { icon: <RelationHeaderIcon />, label: "task", widthClassName: "w-[190px] min-w-[190px] max-w-[190px]" },
  },
  {
    accessorKey: "event",
    cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
    header: "event",
    meta: { icon: <RelationHeaderIcon />, label: "event", widthClassName: "w-[190px] min-w-[190px] max-w-[190px]" },
  },
  {
    accessorKey: "act",
    cell: ({ getValue }) => <RelationChip>{getValue<string>()}</RelationChip>,
    header: "act",
    meta: { icon: <RelationHeaderIcon />, label: "act", widthClassName: "w-[190px] min-w-[190px] max-w-[190px]" },
  },
  {
    accessorKey: "nodeIndex",
    cell: ({ getValue }) => (
      <span className="font-mono text-white/80">{getValue<number>()}</span>
    ),
    header: "nodeIndex",
    meta: {
      icon: <span className="text-white/55">#</span>,
      label: "nodeIndex",
      widthClassName: "w-[144px] min-w-[144px] max-w-[144px]",
    },
  },
  {
    accessorKey: "attempt",
    cell: ({ getValue }) => (
      <span className="font-mono text-white/75">{getValue<number>()}</span>
    ),
    header: "attempt",
    meta: { label: "attempt", widthClassName: "w-[126px] min-w-[126px] max-w-[126px]" },
  },
  {
    accessorKey: "status",
    cell: ({ getValue }) => <StatusChip status={getValue<string>()} />,
    header: "status",
    meta: { label: "status", widthClassName: "w-[180px] min-w-[180px] max-w-[180px]" },
  },
  {
    accessorKey: "userMarkdown",
    cell: ({ getValue }) => <TableTextCell>{getValue<string>()}</TableTextCell>,
    header: "userMarkdown",
    meta: { label: "userMarkdown", widthClassName: "w-[298px] min-w-[298px] max-w-[298px]" },
  },
  {
    accessorKey: "assistantMarkdown",
    cell: ({ getValue }) => <TableTextCell>{getValue<string>()}</TableTextCell>,
    header: "assistantMarkdown",
    meta: { label: "assistantMarkdown", widthClassName: "w-[298px] min-w-[298px] max-w-[298px]" },
  },
  {
    accessorKey: "conversationUrl",
    cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
    header: "conversationUrl",
    meta: { label: "conversationUrl", widthClassName: "w-[298px] min-w-[298px] max-w-[298px]" },
  },
  {
    accessorKey: "sentAt",
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
    header: "sentAt",
    meta: { label: "sentAt", widthClassName: "w-[117px] min-w-[117px] max-w-[117px]" },
  },
  {
    accessorKey: "receivedAt",
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
    header: "receivedAt",
    meta: { label: "receivedAt", widthClassName: "w-[144px] min-w-[144px] max-w-[144px]" },
  },
  {
    accessorKey: "captureMeta",
    cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
    header: "captureMeta",
    meta: { label: "captureMeta", widthClassName: "w-[298px] min-w-[298px] max-w-[298px]" },
  },
  {
    accessorKey: "checksum",
    cell: ({ getValue }) => <TableTextCell mono>{getValue<string>()}</TableTextCell>,
    header: "checksum",
    meta: { label: "checksum", widthClassName: "w-[298px] min-w-[298px] max-w-[298px]" },
  },
  {
    accessorKey: "created",
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
    header: "created",
    meta: { label: "created", widthClassName: "w-[123px] min-w-[123px] max-w-[123px]" },
  },
  {
    accessorKey: "updated",
    cell: ({ getValue }) => <DateCell value={getValue<string>()} />,
    header: "updated",
    meta: { label: "updated", widthClassName: "w-[128px] min-w-[128px] max-w-[128px]" },
  },
]
