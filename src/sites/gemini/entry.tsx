import styles from "./site.module.css"
import { GeminiSidebarClone } from "@/sites/gemini/components/gemini-sidebar-clone"

export function GeminiSite() {
  return <div className={styles.root}><GeminiSidebarClone /></div>
}

export default GeminiSite
