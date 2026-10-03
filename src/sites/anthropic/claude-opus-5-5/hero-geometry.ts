/** Logical-pixel geometry: texture coordinates remain independent of canvas DPR. */
export interface HeroPoint { x: number; y: number }
export interface HeroCircle { cx: number; cy: number; radius: number }
export interface HeroArtwork {
  id: "left" | "middle" | "right"
  src: string
  width: number
  height: number
  circle: HeroCircle
  zoom: number
}
export interface HeroPlacement {
  anchor: HeroPoint
  pivot: HeroPoint
  rotation: number
  scale: number
  circle: HeroCircle
}
export interface HeroLayer {
  artwork: HeroArtwork
  placement: HeroPlacement
  band: readonly [number, number]
  bend: number
}
export interface HeroFrame {
  circle: HeroCircle
  seams: readonly [number, number]
  layers: readonly HeroLayer[]
}

const assetRoot = "/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/images"
// Actual source artwork dimensions and measured horizon circles, not screenshots.
export const HERO_ARTWORK: readonly HeroArtwork[] = [
  { id: "left", src: `${assetRoot}/hero-1.webp`, width: 2560, height: 1440, circle: { cx: 1328.96, cy: 10140.11, radius: 9439.85 }, zoom: 1.2 },
  { id: "middle", src: `${assetRoot}/hero-middle.webp`, width: 2560, height: 1440, circle: { cx: 1262.42, cy: 7862.98, radius: 7162.66 }, zoom: 1 },
  { id: "right", src: `${assetRoot}/hero-0.webp`, width: 2560, height: 1440, circle: { cx: 1220.14, cy: 4304.54, radius: 3596.36 }, zoom: 1.3 },
]

export function clampHero(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)) }
export function smoothHero(value: number) { const t = clampHero(value); return t * t * (3 - 2 * t) }
function mix(from: number, to: number, progress: number) { return from + (to - from) * progress }
function angleAtX(circle: HeroCircle, x: number) { return Math.asin(clampHero((x - circle.cx) / circle.radius, -0.98, 0.98)) }
function pointAtAngle(circle: HeroCircle, angle: number): HeroPoint {
  return { x: circle.cx + circle.radius * Math.sin(angle), y: circle.cy - circle.radius * Math.cos(angle) }
}

/** Find a crop that covers a screen rectangle while aligning the two horizons. */
export function placeHeroArtwork(
  artwork: HeroArtwork,
  target: HeroCircle,
  screenX: number,
  cover: readonly [number, number, number, number],
  viewport: readonly [number, number],
  options: { upright?: number; pivot?: number; margin?: number } = {},
): HeroPlacement {
  const [width, height] = viewport
  const screenAngle = angleAtX(target, screenX)
  const anchor = pointAtAngle(target, screenAngle)
  const margin = options.margin ?? Math.max(18, 0.021 * Math.max(width, height))
  const corners: readonly HeroPoint[] = [
    { x: cover[0] - margin, y: cover[1] - margin }, { x: cover[2] + margin, y: cover[1] - margin },
    { x: cover[0] - margin, y: cover[3] + margin }, { x: cover[2] + margin, y: cover[3] + margin },
  ]
  const low = angleAtX(artwork.circle, artwork.width * 0.12)
  const high = angleAtX(artwork.circle, artwork.width * 0.88)
  const natural = Math.max(width / artwork.width, height / artwork.height)
  function candidate(fraction: number) {
    const angle = mix(low, high, fraction)
    const pivot = pointAtAngle(artwork.circle, angle)
    const rotation = options.upright !== undefined ? 0 : screenAngle - angle
    const cosine = Math.cos(rotation), sine = Math.sin(rotation)
    let minimum = 0
    for (const corner of corners) {
      const dx = corner.x - anchor.x, dy = corner.y - anchor.y
      const x = dx * cosine + dy * sine, y = -dx * sine + dy * cosine
      minimum = Math.max(minimum, x > 0 ? x / Math.max(artwork.width - pivot.x, 1) : -x / Math.max(pivot.x, 1), y > 0 ? y / Math.max(artwork.height - pivot.y, 1) : -y / Math.max(pivot.y, 1))
    }
    const tilt = options.upright !== undefined ? options.upright - angle : rotation
    return { pivot, rotation, minimum, cost: Math.max(1, minimum / natural) + 0.004 * Math.abs(tilt * 180 / Math.PI) }
  }
  let best = candidate(options.pivot ?? 0)
  if (options.pivot === undefined) {
    for (let index = 1; index <= 32; index++) {
      const choice = candidate(index / 32)
      if (choice.cost < best.cost) best = choice
    }
  }
  const radialZoom = clampHero(target.radius / (natural * artwork.circle.radius), 1, 1.2)
  const scale = Math.max(best.minimum, natural * Math.max(artwork.zoom, radialZoom))
  const dx = (artwork.circle.cx - best.pivot.x) * scale
  const dy = (artwork.circle.cy - best.pivot.y) * scale
  const cosine = Math.cos(best.rotation), sine = Math.sin(best.rotation)
  return {
    anchor, pivot: best.pivot, rotation: best.rotation, scale,
    circle: { cx: anchor.x + dx * cosine - dy * sine, cy: anchor.y + dx * sine + dy * cosine, radius: artwork.circle.radius * scale },
  }
}

export function createHeroFrame(width: number, height: number, progress: number): HeroFrame {
  const [left, middle, right] = HERO_ARTWORK
  const narrow = clampHero((1000 - width) / 600)
  const initialLeft = width * (0.27 - narrow * 0.1)
  const initialRight = width * (0.69 + narrow * 0.11)
  const expandedLeft = width < 600 ? Math.max(18, width * 0.045) : Math.max(28, width * 0.06)
  const expandedRight = width - (width < 600 ? Math.max(24, width * 0.06) : Math.max(40, width * 0.085))
  const seamLeft = mix(initialLeft, expandedLeft, progress)
  const seamRight = mix(initialRight, expandedRight, progress)
  const natural = Math.max(width / middle.width, height / middle.height)
  const apex = height * 0.53 - (width <= 760 ? 24 : 0)
  const initialCircle = { cx: width / 2, cy: apex + middle.circle.radius * natural, radius: middle.circle.radius * natural }
  const radius = middle.circle.radius * placeHeroArtwork(middle, initialCircle, width / 2, [0, 0, width, height], [width, height]).scale
  const circle = { cx: width / 2, cy: apex + radius, radius }
  function arcDelta(from: number, to: number) {
    const start = pointAtAngle(circle, angleAtX(circle, from)), end = pointAtAngle(circle, angleAtX(circle, to))
    return { x: end.x - start.x, y: end.y - start.y }
  }
  const leftDelta = arcDelta(initialLeft / 2, seamLeft / 2)
  const rightDelta = arcDelta((initialRight + width) / 2, (seamRight + width) / 2)
  const leftDrop = Math.max(0, arcDelta(initialLeft / 2, expandedLeft / 2).y)
  const rightDrop = Math.max(0, arcDelta((initialRight + width) / 2, (expandedRight + width) / 2).y)
  const leftCover = [-40 + leftDelta.x, -leftDrop + leftDelta.y, initialLeft + 60 + leftDelta.x, height + leftDelta.y] as const
  const rightCover = [initialRight - 60 + rightDelta.x, -rightDrop + rightDelta.y, width + 40 + rightDelta.x, height + rightDelta.y] as const
  const bend = Math.max(18, Math.max(width, height) * 0.035)
  return {
    circle, seams: [seamLeft, seamRight], layers: [
      { artwork: middle, band: [0, width], bend, placement: placeHeroArtwork(middle, circle, width / 2, [0, 0, width, height], [width, height]) },
      { artwork: left, band: [0, seamLeft], bend, placement: placeHeroArtwork(left, circle, seamLeft / 2, leftCover, [width, height], { upright: angleAtX(circle, initialLeft / 2), margin: bend }) },
      { artwork: right, band: [seamRight, width], bend, placement: placeHeroArtwork(right, circle, (seamRight + width) / 2, rightCover, [width, height], { upright: angleAtX(circle, (initialRight + width) / 2), margin: bend }) },
    ],
  }
}
