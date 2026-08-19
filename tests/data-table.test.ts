import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

import {
  clampPagination,
  getLoadedSelectedRecords,
  getNextSorting,
  getSelectedRowIds,
  resolveUpdater,
  selectRowRange,
  toggleRowSelection,
  valueMatchesQuery,
} from "../src/components/data-table/table-model.ts"
import type { RowSelectionState } from "@tanstack/react-table"

type FixtureRecord = {
  id: string
  owner: string
  task: string
  nodeIndex: number
}

const dataTableSource = await readFile(
  new URL("../src/components/data-table/data-table.tsx", import.meta.url),
  "utf8",
)

const records: FixtureRecord[] = [
  { id: "msg_01", owner: "N/A", task: "未命名任务", nodeIndex: 0 },
  { id: "msg_02", owner: "Acme", task: "同步客户", nodeIndex: 3 },
  { id: "msg_03", owner: "Orbit", task: "发送事件", nodeIndex: 8 },
]

test("matches individual visible values case-insensitively", () => {
  assert.equal(valueMatchesQuery("Acme", "acme"), true)
  assert.equal(valueMatchesQuery(8, "8"), true)
  assert.equal(valueMatchesQuery("Orbit", "  ORBIT  "), true)
  assert.equal(valueMatchesQuery("Acme", "Orbit"), false)
})

test("sorts descending first, then toggles direction on repeat clicks", () => {
  assert.deepEqual(getNextSorting([], "owner"), [{ id: "owner", desc: true }])
  assert.deepEqual(
    getNextSorting([{ id: "owner", desc: true }], "owner"),
    [{ id: "owner", desc: false }],
  )
  assert.deepEqual(
    getNextSorting([{ id: "owner", desc: false }], "owner"),
    [{ id: "owner", desc: true }],
  )
})

test("can opt into ascending-first sorting when a product needs it", () => {
  assert.deepEqual(getNextSorting([], "owner", false), [
    { id: "owner", desc: false },
  ])
})

test("replaces the previous single-column sort instead of stacking", () => {
  assert.deepEqual(
    getNextSorting([{ id: "owner", desc: true }], "status"),
    [{ id: "status", desc: true }],
  )
})

test("resolves value and functional state updaters", () => {
  assert.equal(resolveUpdater(5, 1), 5)
  assert.equal(resolveUpdater((current: number) => current + 1, 5), 6)
})

test("toggles checkbox selection without mutating the previous selection", () => {
  const initial: RowSelectionState = { msg_01: true }
  const next = toggleRowSelection(initial, "msg_02", true)

  assert.deepEqual(initial, { msg_01: true })
  assert.deepEqual(next, { msg_01: true, msg_02: true })
  assert.deepEqual(toggleRowSelection(next, "msg_01", false), { msg_02: true })
})

test("selects an inclusive range for shift-click selection", () => {
  assert.deepEqual(
    selectRowRange(
      {},
      records.map((record) => record.id),
      "msg_01",
      "msg_03",
      true,
    ),
    { msg_01: true, msg_02: true, msg_03: true },
  )
})

test("clamps pagination after deletes shrink the last page", () => {
  assert.deepEqual(clampPagination({ pageIndex: 2, pageSize: 8 }, 2), {
    pageIndex: 1,
    pageSize: 8,
  })
  assert.deepEqual(clampPagination({ pageIndex: 1, pageSize: 8 }, 2), {
    pageIndex: 1,
    pageSize: 8,
  })
  assert.deepEqual(clampPagination({ pageIndex: 4, pageSize: 25 }, 0), {
    pageIndex: 0,
    pageSize: 25,
  })
})

test("keeps selected row ids from unloaded manual-pagination pages", () => {
  const selection: RowSelectionState = {
    msg_01: true,
    msg_42: true,
  }

  assert.deepEqual(getSelectedRowIds(selection), ["msg_01", "msg_42"])
})

test("projects selected records from only the currently loaded page", () => {
  const selection: RowSelectionState = {
    msg_02: true,
    msg_42: true,
  }

  assert.deepEqual(
    getLoadedSelectedRecords(records, selection, (record) => record.id),
    [records[1]],
  )
})

test("anchors the bulk action bar outside the table scroll viewport", () => {
  const scrollViewportStart = dataTableSource.indexOf(
    'className="h-full min-h-0 overflow-auto bg-background"',
  )
  const tableClose = dataTableSource.indexOf("</Table>", scrollViewportStart)
  const scrollViewportEnd = dataTableSource.indexOf("</div>", tableClose)
  const bulkActionsStart = dataTableSource.indexOf("<DataTableBulkActions")

  assert.notEqual(scrollViewportStart, -1)
  assert.notEqual(tableClose, -1)
  assert.notEqual(scrollViewportEnd, -1)
  assert.notEqual(bulkActionsStart, -1)
  assert.ok(
    bulkActionsStart > scrollViewportEnd,
    "bulk actions should render after the scroll viewport closes",
  )
})
