"use client"

import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export interface OpusSectionLink {
  anchor: string
  label: string
  heroLabel: string
}

/** Local, scroll-driven recreation of the original horizon. No remote scripts. */
export function OpusHero({ sections }: { sections: readonly OpusSectionLink[] }) {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!hero || !canvas || !context) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const grain = document.createElement("canvas")
    grain.width = grain.height = 256
    const grainContext = grain.getContext("2d")
    if (grainContext) {
      const pixels = grainContext.createImageData(256, 256)
      let seed = 1976
      for (let i = 0; i < pixels.data.length; i += 4) {
        seed = (seed * 16807) % 2147483647
        const value = seed % 256
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value
        pixels.data[i + 3] = 18
      }
      grainContext.putImageData(pixels, 0, 0)
    }

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    function paint() {
      frame = 0
      if (!hero || !canvas || !context) return
      const rect = hero.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const progress = motion.matches ? 1 : Math.min(Math.max(-rect.top / 300, 0), 1)
      const top = motion.matches ? 0 : 335 * (1 - progress)
      const left = 26 - 20 * progress
      const right = 30 - 21.5 * progress
      hero.style.setProperty("--opus-scene-top", `${top}px`)
      hero.style.setProperty("--opus-panel-left", `${left}%`)
      hero.style.setProperty("--opus-panel-right", `${right}%`)
      hero.style.setProperty("--opus-landing-opacity", `${Math.min(progress * 2, 1)}`)
      hero.style.setProperty("--opus-pointer-x", `${motion.matches ? 0 : pointerX * 5}px`)
      hero.style.setProperty("--opus-pointer-y", `${motion.matches ? 0 : pointerY * 3}px`)
      const pixelWidth = Math.round(width * dpr)
      const pixelHeight = Math.round(height * dpr)
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const horizon = Math.min(height * 0.72, 860) + pointerY * (motion.matches ? 0 : 3)
      const skyTop = motion.matches ? 0 : Math.max(top, Math.min(-rect.top, 300))
      const sky = context.createLinearGradient(0, skyTop, 0, horizon + 28)
      sky.addColorStop(0, "#080f18")
      sky.addColorStop(0.17, "#183958")
      sky.addColorStop(0.36, "#47779d")
      sky.addColorStop(0.52, "#7693af")
      sky.addColorStop(0.69, "#9095b1")
      sky.addColorStop(0.83, "#c9a297")
      sky.addColorStop(0.9, "#e8ad6a")
      sky.addColorStop(0.94, "#e47232")
      sky.addColorStop(0.965, "#b92e18")
      sky.addColorStop(1, "#291c1e")
      context.fillStyle = sky
      context.fillRect(0, 0, width, height)
      // Blend the distant horizon into the foreground without a hard silhouette.
      const ground = context.createLinearGradient(0, horizon + 28, 0, height)
      ground.addColorStop(0, "#291c1e")
      ground.addColorStop(0.5, "#141211")
      ground.addColorStop(1, "#0d0c0b")
      context.fillStyle = ground
      context.fillRect(0, horizon + 28, width, height - horizon - 28)
      const texture = context.createPattern(grain, "repeat")
      if (texture) {
        context.fillStyle = texture
        context.fillRect(0, 0, width, height)
      }
    }
    function schedulePaint() {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    function move(event: PointerEvent) {
      if (motion.matches || event.pointerType !== "mouse") return
      const rect = hero?.getBoundingClientRect()
      if (!rect) return
      pointerX = (event.clientX - rect.left) / rect.width - 0.5
      pointerY = (event.clientY - rect.top) / rect.height - 0.5
      schedulePaint()
    }
    function resetPointer() {
      pointerX = pointerY = 0
      schedulePaint()
    }
    const resize = new ResizeObserver(schedulePaint)
    resize.observe(hero)
    window.addEventListener("scroll", schedulePaint, { passive: true })
    hero.addEventListener("pointermove", move, { passive: true })
    hero.addEventListener("pointerleave", resetPointer)
    motion.addEventListener("change", schedulePaint)
    paint()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener("scroll", schedulePaint)
      hero.removeEventListener("pointermove", move)
      hero.removeEventListener("pointerleave", resetPointer)
      motion.removeEventListener("change", schedulePaint)
    }
  }, [])

  return (
    <section className="opus-hero" ref={heroRef} aria-labelledby="opus-hero-title">
      <div className="opus-hero-scene" aria-hidden="true">
        <div className="opus-hero-texture opus-hero-texture-left" />
        <div className="opus-hero-sky"><canvas ref={canvasRef} /></div>
        <div className="opus-hero-texture opus-hero-texture-right" />
      </div>
      <div className="opus-hero-landing">
        <p className="opus-hero-date"><time dateTime="2026-09-22">September 22, 2026</time></p>
        <h1 id="opus-hero-title">Claude Opus 5.5</h1>
        <nav className="opus-hero-contents" aria-label="Article contents">
          <ol>
            {sections.map((section, index) => (
              <li key={section.anchor}>
                <a href={`#${section.anchor}`}><span className="opus-toc-number">({index + 1})</span><span className="opus-toc-dots" aria-hidden="true" /><span>{section.heroLabel}</span></a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <a className="opus-scroll-cue" href="#introduction"><span>Scroll down</span><ArrowDown size={16} aria-hidden="true" /></a>
    </section>
  )
}
