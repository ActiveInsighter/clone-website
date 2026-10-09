"use client"

import { useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./gallery.module.css"

const origin = "https://clone-website-lab.2212148739lbw.workers.dev"
export const installCommand = `npx shadcn@latest add ${origin}/r/reading-motion.json`
const controlled = `"use client"

import { useRef } from "react"
import { CursorHighlight, MotionParagraph } from "@/components/reading-motion"
import type { ReadingMotionHandle } from "@/components/reading-motion"

export function ReadingAnswer() {
  const sentence = useRef<ReadingMotionHandle>(null)

  return (
    <>
      <p>
        The study found that{" "}
        <CursorHighlight ref={sentence} trigger="manual" active={false}>
          attention mattered more than location.
        </CursorHighlight>
      </p>
      <button onClick={() => sentence.current?.play({ scrollIntoView: true })}>
        查看解析
      </button>
      <MotionParagraph trigger="visible">
        <p>A paragraph with a little movement.</p>
      </MotionParagraph>
    </>
  )
}`
const scrollCode = `<p>
  普通文字。
  <CursorHighlight color="blue">
    滚动到这里，鼠标会逐行选中这句话。
  </CursorHighlight>
</p>

<MotionParagraph>
  <p>这段文字随着滚动，从略带倾斜的位置移动归位。</p>
</MotionParagraph>`

export function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setFailed(false) }
    catch { setFailed(true) }
  }
  return (
    <div className={styles.code}>
      <div className={styles.codeHeader}><span>{label}</span><Button variant="ghost" size="sm" onClick={copy} aria-label={`复制${label}`}>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}{copied ? "已复制" : "复制"}</Button></div>
      <pre tabIndex={0}><code>{code}</code></pre>
      {failed && <p role="status">浏览器未允许复制，请直接选中代码复制。</p>}
    </div>
  )
}

export function Integration() {
  return (
    <div className={styles.integration}>
      <section>
        <h2>带到你的下一个项目</h2>
        <p>在已初始化的 shadcn 项目中运行以下命令，即可获得可编辑的组件源码与 CSS Module。支持 React 19、Next.js 和 Vite，动画无需 Framer Motion 或 GSAP。</p>
        <CodeBlock label="安装命令" code={installCommand} />
        <p className="mt-4"><a className={styles.textLink} href="/downloads/reading-motion-kit.tar.gz" download><Download className="mr-2 inline size-4" />下载源码包与接入文档</a></p>
      </section>
      <section><h2>解析按钮，找到原文证据</h2><p>play() 可重复调用。滚动到目标后才开始播放；reset() 清除动画，finish() 直接展示最终状态。也可以用 active 与 playKey 控制。</p><CodeBlock label="React 示例" code={controlled} /></section>
      <section><h2>在博客中，跟随滚动</h2><p>默认 <code>trigger=&quot;scroll&quot;</code>，保持原页的滚动进度驱动。用 <code>trigger=&quot;visible&quot;</code> 可改成进入视口后播放一次。</p><CodeBlock label="滚动示例" code={scrollCode} /></section>
      <section>
        <h2>常用参数</h2>
        <div className={styles.apiWrap}><table className={styles.api}><caption className="sr-only">Reading motion 组件参数</caption><thead><tr><th>参数</th><th>默认值</th><th>用途</th></tr></thead><tbody>
          {[
            ["trigger", '"scroll"', '"scroll" 跟随滚动 / "visible" 进入视口 / "manual" 受控播放'],
            ["active / playKey", "true / —", "控制是否启用；改变 playKey 重新播放"],
            ["duration / delay", "1800 / 0", "播放时长与延迟，单位毫秒；scroll 模式不使用"],
            ["showCursor", "true", "显示或隐藏装饰鼠标，保留文字效果"],
            ["color", '"blue"', '高亮颜色："blue" / "green" / "orange"'],
            ["autoScroll", "false", "手动播放时滚动到目标；也可传给 play()"],
            ["scrollRoot", "页面视口", "指定有独立滚动条的 HTMLElement"],
            ["offset / rotation", "{ x: ≤110, y: 24 } / 5", "段落初始偏移与角度，可设 offset={ { x: 0, y: 0 } }"],
            ["once", "true", "visible 模式播放一次；false 时离开视口后可重播"],
            ["onProgress / onComplete", "—", "获取 0–1 进度 / 完成回调；scroll 反向滚动可再次完成"],
          ].map(row => <tr key={row[0]}><td><code>{row[0]}</code></td><td>{row[1]}</td><td>{row[2]}</td></tr>)}
        </tbody></table></div>
        <p className="mt-4">自定义颜色可设置 CSS 变量 --reading-motion-highlight。文字保留原有排版、链接与复制能力；动画遵循系统的减少动态效果设置。段落周围建议留出空间，或在阅读容器上设置 overflow-x: clip。</p>
      </section>
    </div>
  )
}
