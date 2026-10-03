"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { createHeroFrame, clampHero, smoothHero, HERO_ARTWORK } from "./hero-geometry"
import { createHeroRenderer, type HeroRenderer } from "./hero-renderer"
import "./opus-hero.css"

export interface OpusSectionLink {
  anchor: string
  label: string
  heroLabel: string
}

/** Local artwork, native WebGL, and a sticky stage; scroll input stays native. */
export function OpusHero({ sections }: { sections: readonly OpusSectionLink[] }) {
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackRefs = useRef<Partial<Record<"left" | "middle" | "right", HTMLDivElement>>>({})
  const [landingReady, setLandingReady] = useState(false)
  const inkId = `opus-title-ink-${useId().replace(/:/g, "")}`

  useEffect(() => {
    const hero = heroRef.current, stage = stageRef.current, canvas = canvasRef.current
    if (!hero || !stage || !canvas) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let renderer: HeroRenderer | undefined
    let loader = new AbortController()
    let destroyed = false
    let visible = true
    let frame = 0
    let startedAt: number | undefined
    let ready = false
    let progress = motion.matches ? 1 : 0
    stage.style.setProperty("--opus-title-ink", `url("#${inkId}")`)

    function paint(now: number) {
      frame = 0
      if (!hero || !stage || destroyed || !visible || document.hidden) return
      const heroRect = hero.getBoundingClientRect()
      const width = stage.clientWidth, height = stage.clientHeight
      if (!width || !height || heroRect.bottom <= 0) return
      const travelled = Math.max(0, -heroRect.top)
      if (travelled > 1 && startedAt === undefined) startedAt = now
      const scrollProgress = clampHero(travelled / Math.max(120, height * 0.18))
      const settleProgress = startedAt === undefined ? 0 : smoothHero((now - startedAt) / 950)
      progress = motion.matches ? 1 : Math.max(progress, scrollProgress, settleProgress)
      hero.dataset.phase = progress >= 0.999 ? "settled" : progress > 0.01 ? "revealing" : "intro"
      const scene = createHeroFrame(width, height, smoothHero(progress))
      stage.dataset.geometry = "true"
      stage.style.setProperty("--opus-intro-size", `${clampHero(width * (0.03 + 0.05 * clampHero((1000 - width) / 600)), 22, 58)}px`)
      stage.style.setProperty("--opus-seam-left", `${scene.seams[0]}px`)
      stage.style.setProperty("--opus-seam-right", `${scene.seams[1]}px`)
      stage.style.setProperty("--opus-intro-opacity", `${1 - smoothHero(progress / 0.45)}`)
      stage.style.setProperty("--opus-landing-opacity", `${smoothHero((progress - 0.2) / 0.6)}`)
      stage.style.setProperty("--opus-title-rise", `${(1 - smoothHero(progress)) * 100}px`)
      stage.dataset.expanded = String(progress > 0.8)
      if (ready !== (progress > 0.8)) {
        ready = progress > 0.8
        setLandingReady(ready)
      }
      for (const layer of scene.layers) {
        const image = fallbackRefs.current[layer.artwork.id]
        const { anchor, pivot, rotation, scale } = layer.placement
        if (image) image.style.transform = `translate(${anchor.x}px, ${anchor.y}px) rotate(${rotation}rad) scale(${scale}) translate(${-pivot.x}px, ${-pivot.y}px)`
      }
      if (renderer) {
        renderer.draw(scene, width, height)
        stage.dataset.renderer = "webgl"
        hero.dataset.renderer = "webgl"
      }
      if (!motion.matches && startedAt !== undefined && progress < 1) frame = requestAnimationFrame(paint)
    }
    function schedule() {
      if (!frame && visible && !destroyed && !document.hidden) frame = requestAnimationFrame(paint)
    }
    async function initialize() {
      const signal = loader.signal
      try {
        const next = await createHeroRenderer(canvas!, signal)
        if (destroyed || signal.aborted) { next.dispose(); return }
        renderer = next
        // Draw before revealing the canvas so the CSS artwork never flashes black.
        paint(performance.now())
      } catch {
        if (!destroyed && !signal.aborted) {
          stage!.dataset.renderer = "fallback"
          hero!.dataset.renderer = "fallback"
        }
      }
    }
    function contextLost(event: Event) {
      event.preventDefault()
      loader.abort()
      renderer?.dispose()
      renderer = undefined
      stage!.dataset.renderer = "fallback"
      hero!.dataset.renderer = "fallback"
      schedule()
    }
    function contextRestored() {
      if (destroyed) return
      loader = new AbortController()
      void initialize()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) { cancelAnimationFrame(frame); frame = 0 }
      else schedule()
    })
    observer.observe(hero)
    const resize = new ResizeObserver(schedule)
    resize.observe(stage)
    window.addEventListener("scroll", schedule, { passive: true })
    document.addEventListener("visibilitychange", schedule)
    motion.addEventListener("change", schedule)
    canvas.addEventListener("webglcontextlost", contextLost)
    canvas.addEventListener("webglcontextrestored", contextRestored)
    paint(performance.now())
    void initialize()
    return () => {
      destroyed = true
      loader.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      document.removeEventListener("visibilitychange", schedule)
      motion.removeEventListener("change", schedule)
      canvas.removeEventListener("webglcontextlost", contextLost)
      canvas.removeEventListener("webglcontextrestored", contextRestored)
      renderer?.dispose()
    }
  }, [inkId])

  return (
    <section className="opus-hero" ref={heroRef} aria-labelledby="opus-hero-title" data-phase="intro" data-renderer="loading">
      <div className="opus-hero-stage" ref={stageRef} data-renderer="loading" data-expanded="false">
        <div className="opus-hero-scene" aria-hidden="true">
          {HERO_ARTWORK.filter((artwork) => artwork.id === "middle").concat(HERO_ARTWORK.filter((artwork) => artwork.id !== "middle")).map((artwork) => (
            <div key={artwork.id} className={`opus-hero-fallback opus-hero-fallback-${artwork.id}`}><div className={`opus-hero-artwork opus-hero-artwork-${artwork.id}`} ref={(element) => { if (element) fallbackRefs.current[artwork.id] = element }} /></div>
          ))}
          <canvas ref={canvasRef} className="opus-hero-canvas" />
        </div>
        <svg className="opus-hero-filter-definitions" aria-hidden="true" focusable="false">
          <defs>
            <filter id={inkId} x="-4%" y="-15%" width="108%" height="130%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="texture" />
              <feDisplacementMap in="SourceGraphic" in2="texture" scale="0.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feGaussianBlur in="rough" stdDeviation="0.7" result="soft" />
              <feComponentTransfer in="soft" result="ink"><feFuncA type="linear" slope="1.14" intercept="0" /></feComponentTransfer>
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="12" result="scratches" />
              <feColorMatrix in="scratches" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 0 0 0 6.6" result="holes" />
              <feComposite in="ink" in2="holes" operator="in" />
            </filter>
          </defs>
        </svg>
        <p className="opus-hero-intro" aria-hidden="true">Introducing</p>
        <div className="opus-hero-landing">
          <p className="opus-hero-date"><time dateTime="2026-09-22">September 22, 2026</time></p>
          <h1 id="opus-hero-title" aria-label="Claude Opus 5.5"><span className="opus-hero-title-art" aria-hidden="true"><span className="opus-hero-claude-glyph">{"\uE11C"}</span><span className="opus-hero-title-rest"> Opus 5.5</span></span></h1>
          <nav className="opus-hero-contents" aria-label="Article contents" inert={!landingReady}>
            <ol>{sections.map((section, index) => <li key={section.anchor}><a href={`#${section.anchor}`}><span className="opus-toc-number">({index + 1})</span><span className="opus-toc-dots" aria-hidden="true" /><span>{section.heroLabel}</span></a></li>)}</ol>
          </nav>
        </div>
        <a className="opus-scroll-cue" href="#introduction"><span>Scroll down</span><ArrowDown size={16} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
