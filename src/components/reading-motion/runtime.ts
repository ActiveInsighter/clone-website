/** One event hub and animation frame for all mounted reading effects. */
export interface MotionSubscriber {
  measure: () => void
  paint: (time: number, reduced: boolean) => boolean
}

const subscribers = new Set<MotionSubscriber>()
let frame = 0
let dirty = true
let cleanup: (() => void) | undefined
let reducedQuery: MediaQueryList | undefined

export function requestMotionFrame(remeasure = false) {
  dirty ||= remeasure
  if (!frame && subscribers.size && document.visibilityState !== "hidden") frame = requestAnimationFrame(tick)
}

function tick(time: number) {
  frame = 0
  if (document.visibilityState === "hidden") return
  if (dirty) { dirty = false; subscribers.forEach(entry => entry.measure()) }
  let keepAlive = false
  subscribers.forEach(entry => { keepAlive = entry.paint(time, reducedQuery?.matches ?? false) || keepAlive })
  if (keepAlive) requestMotionFrame()
}

export function subscribeMotion(entry: MotionSubscriber) {
  subscribers.add(entry)
  if (!cleanup) {
    reducedQuery = matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => requestMotionFrame()
    const resize = () => requestMotionFrame(true)
    const visibility = () => {
      if (document.visibilityState === "hidden") { cancelAnimationFrame(frame); frame = 0 }
      else resize()
    }
    // Capture includes nested scroll containers, even when events do not bubble.
    document.addEventListener("scroll", update, { capture: true, passive: true })
    window.addEventListener("resize", resize, { passive: true })
    window.addEventListener("pageshow", resize)
    document.addEventListener("visibilitychange", visibility)
    reducedQuery.addEventListener("change", update)
    let disposed = false
    document.fonts?.ready.then(() => { if (!disposed) resize() })
    document.fonts?.addEventListener("loadingdone", resize)
    cleanup = () => {
      disposed = true
      document.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pageshow", resize)
      document.removeEventListener("visibilitychange", visibility)
      reducedQuery?.removeEventListener("change", update)
      document.fonts?.removeEventListener("loadingdone", resize)
      reducedQuery = undefined
    }
  }
  requestMotionFrame(true)
  return () => {
    subscribers.delete(entry)
    if (!subscribers.size) { cleanup?.(); cleanup = undefined; cancelAnimationFrame(frame); frame = 0; dirty = true }
  }
}
