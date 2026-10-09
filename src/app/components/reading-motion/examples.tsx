"use client"

import { useState } from "react"
import { RotateCcw, ArrowUpRight } from "lucide-react"
import { CursorHighlight, MotionParagraph } from "@/components/reading-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import styles from "./gallery.module.css"

const questions = [
  { id: "evidence-one", question: "1. Why did the researchers return to the same park?", answer: "To compare the effect of two different activities.", explanation: "关键在于 same place 与 different activity 的对照。研究控制了地点，只改变活动，因此可以比较两种活动的影响。" },
  { id: "evidence-two", question: "2. What mattered more than being outdoors?", answer: "How people directed their attention.", explanation: "rather than 引出对比：重点不是身处哪里，而是注意力放在哪里。这个句子直接解释了研究结果。" },
  { id: "evidence-three", question: "3. What does the author suggest we do?", answer: "Notice familiar surroundings with fresh attention.", explanation: "作者用 familiar / fresh 的对照点明建议：无需远行，重新留意身边熟悉的事物就有意义。" },
]

export function ReadingExample({ duration, showCursor }: { duration: number; showCursor: boolean }) {
  const [active, setActive] = useState<string | null>(null)
  const [replay, setReplay] = useState(0)
  const highlight = (id: string) => ({ id, trigger: "manual" as const, active: active === id, playKey: replay, autoScroll: true, duration, showCursor })
  return (
    <div className={styles.reading}>
      <article className={styles.article} lang="en">
        <div className={styles.articleMeta}><Badge variant="secondary">Reading practice</Badge><span>原创示例 · 约 2 分钟</span></div>
        <h2>The art of paying attention</h2>
        <p>On an ordinary Tuesday, a group of volunteers walked through a small city park. Some listened to a podcast. Others were asked to put away their phones and notice the sounds, colours, and shapes around them. At the end of the walk, the second group felt calmer and remembered more of what they had seen.</p>
        <p>The following week, the volunteers returned. <CursorHighlight {...highlight("evidence-one")}>They visited the <strong>same place</strong>, but this time they tried a <em>different activity</em>.</CursorHighlight> Those who had listened to a podcast now walked without headphones. The change in their experience was striking, even though the park itself had barely changed.</p>
        <p>The researchers concluded that <CursorHighlight {...highlight("evidence-two")}>it was the way people directed their attention, rather than simply being outdoors, that made the difference.</CursorHighlight> A tree they had passed a hundred times became interesting again. The ordinary became something worth remembering.</p>
        <p>We often imagine that a memorable experience requires a distant journey. Yet this study suggests a simpler possibility: <CursorHighlight {...highlight("evidence-three")}>we can find something new in familiar surroundings by looking at them with fresh attention.</CursorHighlight> The world may not need to change as much as the way we choose to see it.</p>
      </article>
      <aside className={styles.questions} aria-label="阅读理解题目">
        <h2>带着问题，再读一次</h2>
        <p className={styles.readingHint}>打开解析，鼠标会回到原文，逐行选中答案依据。</p>
        {questions.map(item => (
          <section className={styles.question} key={item.id}>
            <h3>{item.question}</h3>
            <Button variant={active === item.id ? "secondary" : "outline"} aria-expanded={active === item.id} aria-controls={`${item.id}-answer`} onClick={() => { setActive(item.id); setReplay(value => value + 1) }}>
              {active === item.id ? <RotateCcw data-icon="inline-start" /> : <ArrowUpRight data-icon="inline-start" />}
              {active === item.id ? "重播关键句" : "查看解析"}
            </Button>
            {active === item.id && <p className={styles.answer} id={`${item.id}-answer`} role="status"><strong>{item.answer}</strong><br />{item.explanation}</p>}
          </section>
        ))}
        {active && <Button variant="ghost" onClick={() => setActive(null)}>收起解析与高亮</Button>}
      </aside>
    </div>
  )
}

export function BlogExample({ showCursor }: { showCursor: boolean }) {
  return (
    <article className={styles.blog}>
      <div className={styles.articleMeta}><Badge variant="secondary">滚动驱动</Badge><span>缓慢上下滚动，观察鼠标跟随</span></div>
      <h2>阅读，也可以有一点惊喜。</h2>
      <p>我们习惯让文章安静地待在那里：标题、段落、留白。但有时候，一个轻巧的动作，就能让读者愿意停下来，再看一句。</p>
      <p>不需要每段文字都动起来。<CursorHighlight showCursor={showCursor}>把运动留给真正值得注意的那句话，阅读就有了自己的节奏。</CursorHighlight> 其余内容继续自然地流动，像一篇熟悉的博客。</p>
      <div className={styles.blogSpacer} aria-hidden="true" />
      <h3>像有人，替你挪好一段文字</h3>
      <MotionParagraph showCursor={showCursor}><p>一个小小的鼠标走进来，轻轻拉住段落，将它送回舒服的位置。没有打断阅读，只是让原本静止的文字，多了一点可感知的触感。</p></MotionParagraph>
      <p>向下滚动时，文字归位；轻轻往回滚，动作也会沿着原来的路径退回去。你控制的是阅读节奏，页面回应的是你的动作。</p>
      <div className={styles.blogSpacer} aria-hidden="true" />
      <p className={styles.blogQuote}><CursorHighlight color="green" showCursor={showCursor}>好的动画让人看见内容，而不只是看见动画。</CursorHighlight></p>
      <p>当读者选择减少动态效果，文字会保持原位，关键句依旧清楚。趣味可以增添，阅读始终是最重要的事。</p>
    </article>
  )
}
