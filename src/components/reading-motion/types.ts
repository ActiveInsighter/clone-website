import type { ComponentPropsWithoutRef, Ref } from "react"

export interface ReadingMotionHandle {
  /** Play when visible; optionally scroll the target into view first. */
  play: (options?: { scrollIntoView?: boolean }) => void
  reset: () => void
  finish: () => void
  scrollIntoView: () => void
}

export interface ReadingMotionOptions {
  trigger?: "scroll" | "visible" | "manual"
  active?: boolean
  /** Change to replay, including when active already is true. */
  playKey?: string | number
  duration?: number
  delay?: number
  once?: boolean
  showCursor?: boolean
  /** Optional independently scrolling viewport. */
  scrollRoot?: HTMLElement | null
  /** Scroll into view on manual playback; motion starts on arrival. */
  autoScroll?: boolean
  onComplete?: () => void
  onProgress?: (progress: number) => void
  ref?: Ref<ReadingMotionHandle>
}

export interface CursorHighlightProps extends Omit<ComponentPropsWithoutRef<"span">, "onProgress">, ReadingMotionOptions {
  color?: "blue" | "green" | "orange"
}

export interface MotionParagraphProps extends Omit<ComponentPropsWithoutRef<"div">, "onProgress">, ReadingMotionOptions {
  as?: "div" | "span"
  offset?: { x: number; y: number }
  rotation?: number
}
