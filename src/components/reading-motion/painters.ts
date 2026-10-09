import { highlightFrame, measureLines, paragraphFrame, type LineRect } from "./geometry"
import type { MotionPainter } from "./use-reading-motion"
import styles from "./reading-motion.module.css"

function elements(root: HTMLElement) {
  const text = root.querySelector<HTMLElement>("[data-motion-text]")!
  const cursor = root.querySelector<HTMLElement>("[data-motion-cursor]")!
  const glyph = cursor.querySelector("svg")!
  return { text, cursor, glyph }
}

function cursorPose(cursor: HTMLElement, glyph: SVGElement, x: number, y: number, rotation: number, scale: number, opacity: number) {
  cursor.style.transform = `translate3d(${x - 4}px,${y - 4}px,0)`
  cursor.style.opacity = String(opacity)
  glyph.style.transform = `rotate(${rotation}deg) scale(${scale})`
}

export function createHighlightPainter(root: HTMLElement): MotionPainter {
  const { text, cursor, glyph } = elements(root)
  const overlay = root.querySelector<HTMLElement>("[data-motion-overlay]")!
  let lines: LineRect[] = []
  let fills: HTMLElement[] = []
  let rtl = false
  let savedProgress = 0, savedReduced = false, enabled = false
  const draw = (progress: number, reduced: boolean) => {
    enabled = true; savedProgress = progress; savedReduced = reduced
    const result = highlightFrame(lines, progress, rtl)
    fills.forEach((line, i) => { line.style.transform = `scaleX(${result.fills[i]})` })
    cursorPose(cursor, glyph, result.x, result.y, result.rotation, result.scale, reduced ? 0 : result.opacity)
  }
  return {
    measure() {
      rtl = getComputedStyle(root).direction === "rtl"
      lines = measureLines(text, overlay.getBoundingClientRect())
      fills = lines.map(line => {
        const element = document.createElement("span")
        element.className = styles.line
        element.dataset.motionLine = ""
        Object.assign(element.style, { left: `${line.x}px`, top: `${line.y}px`, width: `${line.width}px`, height: `${line.height}px`, transformOrigin: rtl ? "right center" : "left center" })
        return element
      })
      overlay.replaceChildren(...fills)
      if (enabled) draw(savedProgress, savedReduced)
    },
    draw,
    clear() { enabled = false; cursor.style.opacity = "0"; fills.forEach(line => { line.style.transform = "scaleX(0)" }) },
  }
}

export function createParagraphPainter(root: HTMLElement, customOffset?: { x: number; y: number }, customRotation = 5): MotionPainter {
  const { text, cursor, glyph } = elements(root)
  let offset = { x: 110, y: 24 }, width = 0, height = 0, rtl = false
  let savedProgress = 0, savedReduced = false, enabled = false
  const draw = (progress: number, reduced: boolean) => {
    enabled = true; savedProgress = progress; savedReduced = reduced
    const result = paragraphFrame(reduced ? 1 : progress, offset, customRotation * (rtl ? -1 : 1), rtl)
    text.style.transform = result.x === 0 && result.y === 0 && result.rotation === 0 ? "" : `translate3d(${result.x}px,${result.y}px,0) rotate(${result.rotation}deg)`
    const angle = result.rotation * Math.PI / 180
    const anchorX = width * ((rtl ? 0.2 : 0.8) - 0.5), anchorY = height * -0.1
    cursorPose(cursor, glyph, result.x + width / 2 + anchorX * Math.cos(angle) - anchorY * Math.sin(angle), result.y + height / 2 + anchorX * Math.sin(angle) + anchorY * Math.cos(angle), progress < 0.12 ? 75 : 135, result.scale, reduced ? 0 : result.opacity)
  }
  return {
    measure() {
      rtl = getComputedStyle(root).direction === "rtl"
      width = text.offsetWidth; height = text.offsetHeight
      offset = { x: (customOffset?.x ?? Math.min(110, window.innerWidth * 0.18)) * (rtl ? -1 : 1), y: customOffset?.y ?? 24 }
      if (enabled) draw(savedProgress, savedReduced)
    },
    draw,
    clear() { enabled = false; text.style.transform = ""; cursor.style.opacity = "0" },
  }
}
