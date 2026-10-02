import assert from "node:assert/strict"
import test from "node:test"
import { formatChartValue, getChartSeries, getChartTicks, validateChartAxis } from "../src/components/evidence/chart-data.ts"
import type { ChartAxis } from "../src/components/evidence/types.ts"

const cost: ChartAxis = { label: "Cost", domain: [0.1, 25], ticks: [0.1, 1, 10], scale: "log", format: "currency" }
const score: ChartAxis = { label: "Score", domain: [0, 100], ticks: [0, 50, 100], format: "percent" }

test("validates numeric and log domains before asking Recharts to scale them", () => {
  assert.equal(validateChartAxis(cost), null)
  assert.match(validateChartAxis({ ...cost, domain: [0, 25] }) ?? "", /strictly positive/)
  assert.match(validateChartAxis({ ...score, domain: [100, 0] }) ?? "", /increasing/)
  assert.match(validateChartAxis({ ...score, domain: [0, Infinity] }) ?? "", /finite/)
})

test("removes unrepresentable points while preserving exact costs, scores and caller order", () => {
  const series = [{ id: "model", label: "Model", color: "orange", points: [{ x: 2.94, y: 57.6, label: "Med" }, { x: 0, y: 4 }, { x: 1, y: NaN }, { x: 1.29, y: 38.5 }] }]
  const result = getChartSeries(series, cost, score)
  assert.deepEqual(result[0].points, [series[0].points[0], series[0].points[3]])
  assert.equal(series[0].points.length, 4)
})

test("drops duplicate/out-of-domain ticks without inventing replacements", () => {
  assert.deepEqual(getChartTicks({ ...cost, ticks: [-1, 0, 0.1, 1, 1, 25, 26, NaN] }), [0.1, 1, 25])
})

test("tooltips retain exact source values and percent ticks never multiply scores", () => {
  assert.equal(formatChartValue(0.4036, cost), "$0.4036")
  assert.equal(formatChartValue(57.6, score), "57.6%")
  assert.equal(formatChartValue(57.6, score, true), "57.6")
})
