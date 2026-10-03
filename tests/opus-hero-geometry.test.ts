import assert from "node:assert/strict"
import test from "node:test"
import { createHeroFrame } from "../src/sites/anthropic/claude-opus-5-5/hero-geometry.ts"

test("panoramic artwork covers its visible bands across phone, tablet and desktop aspect ratios", () => {
  for (const [width, height] of [[390, 844], [768, 900], [1440, 1000], [2560, 1440], [900, 390]]) {
    for (const progress of [0, 0.5, 1]) {
      const frame = createHeroFrame(width, height, progress)
      assert.ok(frame.seams[0] > 0 && frame.seams[0] < frame.seams[1] && frame.seams[1] < width)
      for (const { artwork, placement, band } of frame.layers) {
        const { anchor, pivot, rotation, scale, circle } = placement
        assert.ok([anchor.x, anchor.y, pivot.x, pivot.y, rotation, scale, circle.cx, circle.cy, circle.radius].every(Number.isFinite))
        assert.ok(scale > 0 && circle.radius > 0)
        for (const x of band) {
          for (const y of [0, height]) {
            const dx = x - anchor.x, dy = y - anchor.y
            const imageX = (dx * Math.cos(rotation) + dy * Math.sin(rotation)) / scale + pivot.x
            const imageY = (-dx * Math.sin(rotation) + dy * Math.cos(rotation)) / scale + pivot.y
            assert.ok(imageX >= 0 && imageX <= artwork.width, `${width}×${height} / ${artwork.id}: horizontal crop has a gap`)
            assert.ok(imageY >= 0 && imageY <= artwork.height, `${width}×${height} / ${artwork.id}: vertical crop has a gap`)
          }
        }
      }
    }
  }
})

test("resizing keeps artwork calculations independent without mutating prior frames", () => {
  const desktop = createHeroFrame(1440, 900, 1)
  const snapshot = JSON.stringify(desktop)
  createHeroFrame(390, 844, 0)
  assert.equal(JSON.stringify(desktop), snapshot)
  assert.deepEqual(createHeroFrame(1440, 900, 1), desktop)
})
