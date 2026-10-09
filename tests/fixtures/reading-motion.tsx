import { StrictMode, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { CursorHighlight, MotionParagraph, type ReadingMotionHandle } from "../../src/components/reading-motion"

declare global {
  interface Window { motionFixture: { completed: number; progress: number; farProgress: number; mounted: boolean } }
}
window.motionFixture = { completed: 0, progress: 0, farProgress: 0, mounted: true }

function Fixture() {
  const selection = useRef<ReadingMotionHandle>(null)
  const paragraph = useRef<ReadingMotionHandle>(null)
  const far = useRef<ReadingMotionHandle>(null)
  const [mounted, setMounted] = useState(true)
  const [rtl, setRtl] = useState(false)
  const [edited, setEdited] = useState(false)
  const [nested, setNested] = useState<HTMLDivElement | null>(null)
  const [color, setColor] = useState<"blue" | "green">("blue")
  return <>
    <nav>
      <button onClick={() => selection.current?.play()}>play</button>
      <button onClick={() => selection.current?.reset()}>reset</button>
      <button onClick={() => selection.current?.finish()}>finish</button>
      <button onClick={() => { setMounted(value => !value); window.motionFixture.mounted = !mounted }}>mount</button>
      <button onClick={() => setRtl(value => !value)}>rtl</button>
      <button onClick={() => setEdited(true)}>edit</button>
      <button onClick={() => setColor("green")}>color</button>
      <button onClick={() => paragraph.current?.play()}>move</button>
      <button onClick={() => far.current?.play({ scrollIntoView: true })}>scrollplay</button>
    </nav>
    {mounted && <article dir={rtl ? "rtl" : "ltr"} className="fixture-article">
      <p><CursorHighlight id="fixture-manual" ref={selection} trigger="manual" active={false} color={color} duration={600} onProgress={progress => { window.motionFixture.progress = progress }} onComplete={() => { window.motionFixture.completed++ }}>
        {edited ? "Short replacement." : <>A <strong>carefully chosen sentence</strong> can wrap across several lines without changing the surrounding text. <a href="#destination">An accessible link</a> stays available.</>}
      </CursorHighlight></p>
      <MotionParagraph id="fixture-paragraph" ref={paragraph} trigger="manual" active={false} duration={600} offset={{ x: 0, y: 0 }} rotation={10}><p>A paragraph that rotates in place.</p></MotionParagraph>
    </article>}
    <div id="nested-root" ref={setNested}>
      <div className="fixture-space" />
      <p><CursorHighlight id="fixture-nested" scrollRoot={nested}>Nested scrolling must follow its own viewport.</CursorHighlight></p>
      <div className="fixture-space" />
    </div>
    <div id="destination">Link destination</div>
    <div className="fixture-space" /><div className="fixture-space" /><div className="fixture-space" />
    <p><CursorHighlight ref={far} id="fixture-far" trigger="manual" active={false} duration={600} onProgress={value => { window.motionFixture.farProgress = value }}>A distant sentence should wait for the scrolling to settle.</CursorHighlight></p>
    <div className="fixture-space" />
  </>
}

createRoot(document.getElementById("root")!).render(<StrictMode><Fixture /></StrictMode>)
