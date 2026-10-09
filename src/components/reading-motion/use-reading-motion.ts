"use client"

import { useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react"
import type { ReadingMotionHandle, ReadingMotionOptions } from "./types"
import { clamp, scrollProgress } from "./geometry"
import { requestMotionFrame, subscribeMotion } from "./runtime"

export interface MotionPainter { measure: () => void; draw: (progress: number, reduced: boolean) => void; clear: () => void }

export function useReadingMotion(options: ReadingMotionOptions, createPainter: (root: HTMLElement) => MotionPainter) {
  const { trigger = "scroll", active = true, playKey, duration = 1800, delay = 0, once = true, scrollRoot, autoScroll = false, ref } = options
  const rootRef = useRef<HTMLElement>(null)
  const commands = useRef<ReadingMotionHandle | null>(null)
  const callbacks = useRef({ onComplete: options.onComplete, onProgress: options.onProgress })
  useEffect(() => { callbacks.current = { onComplete: options.onComplete, onProgress: options.onProgress } }, [options.onComplete, options.onProgress])
  useImperativeHandle(ref, () => ({
    play: settings => commands.current?.play(settings),
    reset: () => commands.current?.reset(),
    finish: () => commands.current?.finish(),
    scrollIntoView: () => commands.current?.scrollIntoView(),
  }), [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const painter = createPainter(root)
    let started: number | null = null
    let pending = active && trigger !== "scroll"
    let finished = false
    let paused = !active
    let current = 0
    let last = -1
    let lastReduced = false
    let lastTime = 0
    let focused = false
    let explicitPlayback = trigger === "manual"
    let awaitingScroll = false
    let lastScrollTop = 0
    let stableSince = 0
    let requestedAt = 0
    const scroll = () => root.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
    const scrollBeforePlayback = () => {
      awaitingScroll = true
      lastScrollTop = root.getBoundingClientRect().top
      stableSince = requestedAt = performance.now()
      scroll()
    }
    const complete = () => { if (!finished) { finished = true; callbacks.current.onComplete?.() } }
    const paint = (time: number, reduced: boolean) => {
      if (paused) return false
      const rect = root.getBoundingClientRect()
      const bounds = scrollRoot?.getBoundingClientRect()
      const rootTop = bounds ? bounds.top + scrollRoot!.clientTop : 0
      const rootHeight = scrollRoot?.clientHeight ?? window.innerHeight
      const visible = explicitPlayback
        ? rect.bottom > rootTop && rect.top < rootTop + rootHeight
        : rect.bottom > rootTop + rootHeight * 0.15 && rect.top < rootTop + rootHeight * 0.85
      if (awaitingScroll) {
        if (Math.abs(rect.top - lastScrollTop) > 0.5) stableSince = time
        lastScrollTop = rect.top
        // A stable-position fallback also covers browsers without scrollend,
        // interrupted smooth scrolls, and targets already in the center.
        if (reduced || focused || time - stableSince >= 120 || time - requestedAt >= 2500) awaitingScroll = false
      }
      if (trigger === "scroll" && !pending && started === null) {
        const target = scrollProgress(rect.top, rect.height, rootTop, rootHeight)
        const dt = lastTime ? Math.min(64, time - lastTime) : 64
        current = reduced || focused || !lastTime ? target : current + (target - current) * (1 - Math.exp(-dt / 55))
        if (Math.abs(target - current) < 0.0005) current = target
      } else {
        if (pending && visible && !awaitingScroll) { pending = false; started = time + (Number.isFinite(delay) ? Math.max(0, delay) : 0); finished = false }
        if (started !== null) current = reduced || focused ? 1 : clamp((time - started) / (Number.isFinite(duration) ? Math.max(1, duration) : 1800))
        if (current === 1 && !once && trigger === "visible" && !visible) { current = 0; started = null; pending = true; finished = false }
      }
      if (reduced || focused) current = trigger === "scroll" || !pending || finished ? 1 : current
      if (current !== last || (reduced || focused) !== lastReduced) {
        painter.draw(current, reduced || focused)
        root.dataset.state = current === 1 ? "complete" : current === 0 ? "idle" : "playing"
        callbacks.current.onProgress?.(current)
        last = current; lastReduced = reduced || focused
      }
      if (current === 1) complete()
      else if (trigger === "scroll") finished = false
      lastTime = time
      const target = scrollProgress(rect.top, rect.height, rootTop, rootHeight)
      return awaitingScroll || (!reduced && !focused && ((started !== null && current < 1) || (trigger === "scroll" && !pending && started === null && Math.abs(target - current) > 0.0005)))
    }
    commands.current = {
      play(settings) {
        paused = false; pending = true; started = null; current = 0; finished = false; last = -1; awaitingScroll = false; explicitPlayback = true
        painter.clear(); root.dataset.state = "idle"
        if (settings?.scrollIntoView ?? autoScroll) scrollBeforePlayback()
        requestMotionFrame(true)
      },
      reset() { paused = true; pending = false; awaitingScroll = false; started = null; current = 0; last = -1; finished = false; painter.clear(); root.dataset.state = "idle"; callbacks.current.onProgress?.(0) },
      finish() { paused = true; pending = false; awaitingScroll = false; started = null; current = 1; painter.measure(); painter.draw(1, true); root.dataset.state = "complete"; callbacks.current.onProgress?.(1); complete() },
      scrollIntoView: scroll,
    }
    const focusIn = () => { focused = true; requestMotionFrame() }
    const focusOut = () => { focused = false; requestMotionFrame() }
    root.addEventListener("focusin", focusIn)
    root.addEventListener("focusout", focusOut)
    const observer = new ResizeObserver(() => requestMotionFrame(true))
    observer.observe(root)
    if (root.parentElement) observer.observe(root.parentElement)
    if (scrollRoot) observer.observe(scrollRoot)
    const mutation = new MutationObserver(() => requestMotionFrame(true))
    const text = root.querySelector("[data-motion-text]")
    if (text) mutation.observe(text, { childList: true, characterData: true, subtree: true })
    const unsubscribe = subscribeMotion({ measure: painter.measure, paint })
    if (pending && autoScroll && trigger === "manual") scrollBeforePlayback()
    if (!active) { painter.clear(); root.dataset.state = "idle" }
    return () => {
      unsubscribe(); observer.disconnect(); mutation.disconnect(); commands.current = null
      root.removeEventListener("focusin", focusIn); root.removeEventListener("focusout", focusOut)
      painter.clear()
    }
  }, [active, autoScroll, createPainter, delay, duration, once, playKey, scrollRoot, trigger])
  return rootRef
}
