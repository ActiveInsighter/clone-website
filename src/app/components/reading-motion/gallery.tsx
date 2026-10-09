"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Moon, MousePointer2, RotateCcw, Sun } from "lucide-react"
import { CursorHighlight, MotionParagraph, type ReadingMotionHandle } from "@/components/reading-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BlogExample, ReadingExample } from "./examples"
import { Integration } from "./integration"
import styles from "./gallery.module.css"

export function ReadingMotionGallery() {
  const [theme, setTheme] = useState("light")
  const [duration, setDuration] = useState(2400)
  const [cursor, setCursor] = useState(true)
  const [color, setColor] = useState<"blue" | "green" | "orange">("blue")
  const selection = useRef<ReadingMotionHandle>(null)
  const paragraph = useRef<ReadingMotionHandle>(null)
  return (
    <main className={styles.root} data-theme={theme}>
      <header className={styles.nav}>
        <div className={styles.brand}><MousePointer2 aria-hidden="true" /><span>Reading motion</span><Badge variant="secondary">shadcn</Badge></div>
        <nav className={styles.navActions} aria-label="组件导航"><Link href="/clones"><ArrowLeft className="mr-1 inline size-3" />组件实验室</Link><a href="/downloads/reading-motion-kit.tar.gz" download><Download className="mr-1 inline size-3" />下载源码</a></nav>
      </header>
      <div className={styles.main}>
        <div className={styles.intro}><h1>让文字，动起来。</h1><p>一个鼠标，选中一句值得读的话。<br />一个轻轻的拖动，把段落放回刚好的位置。<br />把这些小小的阅读趣味，放进你的文章与题目里。</p></div>
        <Tabs defaultValue="lab">
          <div className={styles.tabBar}>
            <TabsList variant="line" aria-label="演示场景"><TabsTrigger value="lab">效果实验室</TabsTrigger><TabsTrigger value="reading">阅读理解</TabsTrigger><TabsTrigger value="blog">博客文章</TabsTrigger><TabsTrigger value="code">接入代码</TabsTrigger></TabsList>
            <div className={styles.toolbar}><Button variant="ghost" size="icon" aria-label={theme === "light" ? "切换深色" : "切换浅色"} onClick={() => setTheme(value => value === "light" ? "dark" : "light")}>{theme === "light" ? <Moon /> : <Sun />}</Button></div>
          </div>
          <TabsContent value="lab">
            <div className={styles.lab}>
              <div className={styles.stage}>
                <div className={styles.stageHeader}><h2>鼠标选句</h2><Button variant="ghost" size="sm" onClick={() => selection.current?.play()}><RotateCcw data-icon="inline-start" />重播选句</Button></div>
                <p className={styles.selectionDemo}>让阅读有一点惊喜。<br /><CursorHighlight ref={selection} trigger="visible" duration={duration} color={color} showCursor={cursor}>把关键句选出来，<br />让重要的想法被看见。</CursorHighlight></p>
                <p className={styles.stageHint}>鼠标逐行划过，留下自然的选中痕迹。</p>
                <Separator className={styles.demoDivider} />
                <div className={styles.stageHeader}><h2>段落移动</h2><Button variant="ghost" size="sm" onClick={() => paragraph.current?.play()}><RotateCcw data-icon="inline-start" />重播段落</Button></div>
                <MotionParagraph ref={paragraph} trigger="visible" duration={duration} delay={400} showCursor={cursor} className={styles.paragraphDemo}>The best ideas deserve<br />a little movement.</MotionParagraph>
                <p className={styles.stageHint}>鼠标轻轻带动文字，沿着弧线归位。</p>
              </div>
              <aside className={styles.controls} aria-label="动画设置">
                <h2>调成你喜欢的样子</h2>
                <div className={styles.control}><div className={styles.controlLabel}><label id="duration-label">播放时长</label><span>{(duration / 1000).toFixed(1)} 秒</span></div><Slider value={[duration]} min={900} max={4200} step={300} aria-labelledby="duration-label" onValueChange={value => setDuration(Array.isArray(value) ? value[0] : value)} /><small>慢一点，仔细看鼠标的轨迹。</small></div>
                <div className={styles.control}><div className={styles.controlLabel}><label htmlFor="show-cursor">显示动画鼠标</label><Switch id="show-cursor" checked={cursor} onCheckedChange={setCursor} /></div><small>保留真实鼠标，动画鼠标只参与演示。</small></div>
                <div className={styles.control}><div className={styles.controlLabel} id="color-label">选中颜色</div><ToggleGroup value={[color]} onValueChange={values => { const next = values[0]; if (next === "blue" || next === "green" || next === "orange") setColor(next) }} aria-labelledby="color-label" className={styles.colorOptions} variant="outline"><ToggleGroupItem value="blue" aria-label="蓝色">蓝</ToggleGroupItem><ToggleGroupItem value="green" aria-label="绿色">绿</ToggleGroupItem><ToggleGroupItem value="orange" aria-label="橙色">橙</ToggleGroupItem></ToggleGroup></div>
                <Button variant="outline" onClick={() => { selection.current?.play(); paragraph.current?.play() }}><RotateCcw data-icon="inline-start" />一起重播</Button>
              </aside>
            </div>
            <div className={styles.below}><p>从一行到多行，从桌面到手机。<br />文字仍然可以选择、复制，动画不改变正文。</p><Button variant="secondary" onClick={() => { selection.current?.reset(); paragraph.current?.reset() }}>清除动画</Button></div>
          </TabsContent>
          <TabsContent value="reading"><ReadingExample duration={duration} showCursor={cursor} /></TabsContent>
          <TabsContent value="blog"><BlogExample showCursor={cursor} /></TabsContent>
          <TabsContent value="code"><Integration /></TabsContent>
        </Tabs>
        <footer className={styles.footer}><span>React 19 · CSS Module · 可编辑源码<br />尊重减少动态效果，保留自然的阅读体验。</span><span>效果参考 <a href="https://openai.com/zh-Hans-CN/index/gpt-6-for-everyone/" target="_blank" rel="noreferrer">OpenAI 原页</a>，独立封装为可复用组件。</span></footer>
      </div>
    </main>
  )
}
