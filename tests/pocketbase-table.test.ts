import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

import {
  filterPocketBaseRecords,
  getPocketBaseSort,
  selectPocketBaseRange,
  togglePocketBaseSelection,
} from "../src/components/pocketbase-table/table-model.ts"
import type { RowSelectionState } from "@tanstack/react-table"

type FixtureRecord = {
  id: string
  owner: string
  task: string
  nodeIndex: number
}

const records: FixtureRecord[] = [
  { id: "msg_01", owner: "N/A", task: "未命名任务", nodeIndex: 0 },
  { id: "msg_02", owner: "Acme", task: "同步客户", nodeIndex: 3 },
  { id: "msg_03", owner: "Orbit", task: "发送事件", nodeIndex: 8 },
]

test("renders the bulk action bar as an overlay instead of a layout participant", async () => {
  const source = await readFile(
    new URL("../src/components/pocketbase-table/bulk-action-bar.tsx", import.meta.url),
    "utf8",
  )

  assert.match(source, /absolute/)
  assert.doesNotMatch(source, /sticky/)
})

test("filters records across visible fields case-insensitively", () => {
  assert.deepEqual(
    filterPocketBaseRecords(records, "acme"),
    [records[1]],
  )
  assert.deepEqual(
    filterPocketBaseRecords(records, "8"),
    [records[2]],
  )
})

test("keeps the PocketBase sort rhythm: descending first, then ascending", () => {
  assert.deepEqual(getPocketBaseSort([], "owner"), [{ id: "owner", desc: true }])
  assert.deepEqual(
    getPocketBaseSort([{ id: "owner", desc: true }], "owner"),
    [{ id: "owner", desc: false }],
  )
  assert.deepEqual(
    getPocketBaseSort([{ id: "owner", desc: false }], "owner"),
    [{ id: "owner", desc: true }],
  )
})

test("toggles checkbox selection without mutating the previous selection", () => {
  const initial: RowSelectionState = { msg_01: true }
  const next = togglePocketBaseSelection(initial, "msg_02", true)

  assert.deepEqual(initial, { msg_01: true })
  assert.deepEqual(next, { msg_01: true, msg_02: true })
  assert.deepEqual(togglePocketBaseSelection(next, "msg_01", false), { msg_02: true })
})

test("selects an inclusive range for shift-click selection", () => {
  assert.deepEqual(
    selectPocketBaseRange({}, records.map((record) => record.id), "msg_01", "msg_03", true),
    { msg_01: true, msg_02: true, msg_03: true },
  )
})
