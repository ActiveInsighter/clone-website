import "@/components/openai-navigation/responsive-navigation.css"
import "./components/openai-navigation.css"
import styles from "./site.module.css"
import { OpenAiHome } from "@/sites/openai/components/openai-home"

export function OpenAiSite() {
  return <div className={styles.root}><OpenAiHome /></div>
}

export default OpenAiSite
