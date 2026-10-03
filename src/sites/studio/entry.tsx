import styles from "./site.module.css"
import { StudioDemo } from "@/sites/studio/demo"

export function StudioSite() {
  return <div className={styles.root}><StudioDemo /></div>
}

export default StudioSite
