import styles from "./reading-motion.module.css"
import { cn } from "@/lib/utils"

/** Decorative cursor; never hides or replaces the reader's real pointer. */
export function ReadingCursor({ show = true }: { show?: boolean }) {
  return (
    <span data-motion-cursor aria-hidden="true" className={cn(styles.cursor, !show && styles.hiddenCursor)}>
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4.4 3.1C3.2 3.3 2.6 4.5 3.1 5.9L7.8 19.3C8.5 21.4 10.4 22 11.5 19.9L14.1 14.8L19.3 12.2C21.4 11.1 20.8 9.2 18.7 8.5L5.3 3.7C4.9 3.6 4.6 3.5 4.4 3.1Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
