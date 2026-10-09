"use client"

import { useCallback } from "react"
import { useReadingMotion } from "./use-reading-motion"
import { createParagraphPainter } from "./painters"
import { ReadingCursor } from "./cursor"
import type { MotionParagraphProps } from "./types"
import styles from "./reading-motion.module.css"
import { cn } from "@/lib/utils"

export function MotionParagraph({ children, className, as: Tag = "div", offset, rotation = 5, trigger, active, playKey, duration, delay, once, showCursor = true, scrollRoot, autoScroll, onComplete, onProgress, ref, ...props }: MotionParagraphProps) {
  const x = offset?.x, y = offset?.y
  const createPainter = useCallback((root: HTMLElement) => createParagraphPainter(root, x !== undefined && y !== undefined ? { x, y } : undefined, rotation), [x, y, rotation])
  const root = useReadingMotion({ trigger, active, playKey, duration, delay, once, scrollRoot, autoScroll, onComplete, onProgress, ref }, createPainter)
  const TextTag = Tag === "span" ? "span" : "div"
  return (
    <Tag {...props} ref={root as React.RefObject<HTMLDivElement>} className={cn(styles.paragraph, Tag === "span" && styles.inline, className)} data-reading-motion="paragraph" data-state="idle">
      <TextTag className={styles.paragraphText} data-motion-text>{children}</TextTag>
      <ReadingCursor show={showCursor} />
    </Tag>
  )
}
