"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Pause, Play, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { RichText } from "./rich-text"
import type { ResponseComparisonProps, ResponseExample, RichTextBlock } from "./types"

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function motionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function serverMotionSnapshot() { return false }

function responseLength(blocks: readonly RichTextBlock[]) {
  return blocks.reduce((sum, block) => sum + (block.code !== undefined ? block.code.length : block.spans.reduce((length, span) => length + span.text.length, 0)), 0)
}

/** Keep the original marks and links while revealing only a prefix of the supplied response. */
function revealedBlocks(blocks: readonly RichTextBlock[], limit: number): RichTextBlock[] {
  const result: RichTextBlock[] = []
  let remaining = limit
  for (const block of blocks) {
    if (remaining <= 0) break
    if (block.code !== undefined) {
      result.push({ ...block, code: block.code.slice(0, remaining) })
      remaining -= block.code.length
    } else {
      const spans = []
      for (const span of block.spans) {
        if (remaining <= 0) break
        spans.push({ ...span, text: span.text.slice(0, remaining) })
        remaining -= span.text.length
      }
      result.push({ ...block, spans })
    }
  }
  return result
}

function ResponsePlayback({ example }: { example: ResponseExample }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const length = Math.max(responseLength(example.left.blocks), responseLength(example.right.blocks))
  const visible = reducedMotion ? length : progress
  const complete = visible >= length
  const running = playing && !complete
  const state = complete ? "Complete" : running ? "Playing" : progress > 0 ? "Paused" : "Ready"

  useEffect(() => {
    if (!running || reducedMotion) return
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 24, length)), 32)
    return () => window.clearInterval(timer)
  }, [length, reducedMotion, running])

  function replay() {
    setProgress(0)
    setPlaying(true)
  }

  function togglePlayback() {
    if (complete) replay()
    else setPlaying((value) => !value)
  }

  const actionLabel = complete ? "Replay" : running ? "Pause" : progress > 0 ? "Resume" : "Play"

  return (
    <div className="evidence-response__playback">
      <div className="evidence-response__controls">
        <span className="evidence-response__status" role="status" aria-live="polite" aria-atomic="true">{state}</span>
        <Button variant="outline" size="sm" className="evidence-response__button" onClick={togglePlayback} disabled={length === 0}>
          {running ? <Pause aria-hidden="true" /> : complete ? <RotateCw aria-hidden="true" /> : <Play aria-hidden="true" />}{actionLabel}
        </Button>
        <Button variant="outline" size="icon" className="evidence-response__button" aria-label="Replay both responses" onClick={replay} disabled={length === 0}><RotateCw aria-hidden="true" /></Button>
      </div>
      <div className="evidence-response__columns">
        {([example.left, example.right] as const).map((response, index) => (
          <section key={index} className="evidence-response__column" aria-label={`${response.label} response`}>
            <h4 className={cn("evidence-response__model", index === 0 && "evidence-response__model--featured")}>{response.label}</h4>
            <Card className="evidence-response__card">
              <CardContent className="evidence-response__output" tabIndex={0} role="region" aria-label={`${response.label} scrollable output`}>
                <p className="evidence-response__prompt">{example.prompt}</p>
                <div aria-hidden={!complete} inert={!complete} className="evidence-response__visual"><RichText blocks={revealedBlocks(response.blocks, visible)} /></div>
                {!complete && <div className="evidence-visually-hidden evidence-response__accessible"><RichText blocks={response.blocks} /></div>}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  )
}

export function ResponseComparison({ examples, className }: ResponseComparisonProps) {
  const [selected, setSelected] = useState(examples[0]?.id ?? "")
  const active = examples.some((example) => example.id === selected) ? selected : examples[0]?.id ?? ""
  if (!examples.length) return <div className={cn("evidence-response evidence-widget-empty", className)}>No comparison examples available.</div>

  return (
    <Tabs value={active} onValueChange={(value) => { if (typeof value === "string") setSelected(value) }} className={cn("evidence-response", className)}>
      <TabsList variant="line" aria-label="Response comparison examples" className="evidence-editorial-tabs">
        {examples.map((example) => <TabsTrigger key={example.id} value={example.id} className="evidence-editorial-tab">{example.label}</TabsTrigger>)}
      </TabsList>
      {examples.map((example) => (
        <TabsContent key={example.id} value={example.id} className="evidence-response__panel">
          {active === example.id && <ResponsePlayback key={example.id} example={example} />}
        </TabsContent>
      ))}
    </Tabs>
  )
}
