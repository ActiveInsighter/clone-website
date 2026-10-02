import assert from "node:assert/strict"
import test from "node:test"
import { articleNodes } from "../src/components/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/article-data.ts"

test("source content preserves every benchmark, chart point and interactive state", () => {
  const benchmark = articleNodes.find(node => node.type === "benchmark")
  assert.equal(benchmark?.columns.length, 5)
  assert.equal(benchmark?.rows.length, 9)
  assert.equal(benchmark?.highlightColumn, "Opus 5.5")
  assert.equal(articleNodes.find(node => node.type === "pricing")?.rows.length, 4)
  const tabs = articleNodes.flatMap(node => node.type === "charts" ? node.tabs : [])
  assert.equal(tabs.length, 6)
  assert.equal(tabs.reduce((sum, tab) => sum + tab.chart.series.reduce((count, series) => count + series.points.length, 0), 0), 130)
  assert.equal(articleNodes.reduce((sum, node) => sum + (node.type === "testimonials" ? node.items.length : 0), 0), 21)
  assert.equal(articleNodes.find(node => node.type === "responses")?.examples.length, 3)
})

test("source charts retain valid numeric coordinates and logarithmic domains", () => {
  for (const tab of articleNodes.flatMap(node => node.type === "charts" ? node.tabs : [])) {
    const { xAxis, yAxis, series } = tab.chart
    assert.ok(xAxis.domain[0] < xAxis.domain[1])
    assert.ok(yAxis.domain[0] < yAxis.domain[1])
    if (xAxis.scale === "log") assert.ok(xAxis.domain[0] > 0)
    for (const point of series.flatMap(item => item.points)) {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y))
      assert.ok(point.x >= xAxis.domain[0] && point.x <= xAxis.domain[1], tab.label)
      assert.ok(point.y >= yAxis.domain[0] && point.y <= yAxis.domain[1], tab.label)
    }
  }
})
