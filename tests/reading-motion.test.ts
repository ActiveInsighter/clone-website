import assert from "node:assert/strict"
import test from "node:test"
import { highlightFrame, mergeLineRects, paragraphFrame, scrollProgress } from "../src/components/reading-motion/geometry.ts"

test("selection walks wrapped lines in reading order and persists at completion", () => {
  const lines = [{ x: 0, y: 0, width: 100, height: 20 }, { x: -30, y: 28, width: 60, height: 20 }]
  assert.deepEqual(highlightFrame(lines, 0).fills, [0, 0])
  const middle = highlightFrame(lines, 0.5)
  assert.ok(middle.fills[0] > 0.8)
  assert.equal(middle.fills[1], 0)
  assert.deepEqual(highlightFrame(lines, 1).fills, [1, 1])
  assert.equal(highlightFrame(lines, 1).opacity, 0)
  assert.equal(highlightFrame([], 0.5).opacity, 0)
})

test("rich inline rectangles merge per line without extending through unrelated text", () => {
  const rects = [{ x: 35, y: 1, width: 30, height: 20 }, { x: 0, y: 0, width: 35, height: 22 }, { x: -20, y: 28, width: 60, height: 22 }, { x: 0, y: 0, width: 0, height: 0 }]
  assert.deepEqual(mergeLineRects(rects), [{ x: 0, y: 0, width: 65, height: 22 }, { x: -20, y: 28, width: 60, height: 22 }])
})

test("RTL selection begins at the right edge and advances left", () => {
  const line = [{ x: 0, y: 0, width: 100, height: 20 }]
  const start = highlightFrame(line, 0.2, true)
  const middle = highlightFrame(line, 0.5, true)
  assert.equal(start.x, 100)
  assert.ok(middle.x < start.x)
  assert.ok(middle.x > 0)
})

test("mixed inline font sizes preserve the entire vertical extent", () => {
  assert.deepEqual(mergeLineRects([{ x: 0, y: 0, width: 35, height: 20 }, { x: 35, y: 5, width: 30, height: 20 }]), [{ x: 0, y: 0, width: 65, height: 25 }])
})

test("scroll progress covers entry through mid-viewport and works with a custom root", () => {
  assert.equal(scrollProgress(800, 20, 0, 800), 0)
  assert.equal(scrollProgress(390, 20, 0, 800), 1)
  assert.equal(scrollProgress(850, 20, 50, 800), 0)
  assert.equal(scrollProgress(-100, 20, 0, 800), 1)
})

test("paragraph arrives at its natural position without layout displacement", () => {
  assert.equal(paragraphFrame(0, { x: 110, y: 24 }, 5).x, 110)
  assert.equal(paragraphFrame(0, { x: 110, y: 24 }, 5).rotation, 5)
  const end = paragraphFrame(1, { x: 110, y: 24 }, 5)
  assert.equal(end.x, 0)
  assert.equal(end.y, 0)
  assert.equal(end.rotation, 0)
  assert.equal(end.opacity, 0)
})
