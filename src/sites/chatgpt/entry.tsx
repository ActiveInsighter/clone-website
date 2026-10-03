import styles from "./site.module.css"
import { ChatGptHome } from "@/sites/chatgpt/home"

export function ChatGptSite() {
  return <div className={styles.root}><ChatGptHome initialDark /></div>
}

export default ChatGptSite
