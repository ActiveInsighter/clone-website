"use client"

import { useReadingMotion } from "./use-reading-motion"
import { createHighlightPainter } from "./painters"
import { ReadingCursor } from "./cursor"
import type { CursorHighlightProps } from "./types"
import styles from "./reading-motion.module.css"
import { cn } from "@/lib/utils"

export function CursorHighlight({ children, className, color = "blue", trigger, active, playKey, duration, delay, once, showCursor = true, scrollRoot, autoScroll, onComplete, onProgress, ref, ...props }: CursorHighlightProps) {
  const root = useReadingMotion({ trigger, active, playKey, duration, delay, once, scrollRoot, autoScroll, onComplete, onProgress, ref }, createHighlightPainter)
  return (
    <span {...props} ref={root} className={cn(styles.highlight, className)} data-color={color} data-reading-motion="highlight" data-state="idle">
      <span className={styles.overlay} data-motion-overlay aria-hidden="true" />
      <span className={styles.text} data-motion-text>{children}</span>
      <ReadingCursor show={showCursor} />
    </span>
  )
}
