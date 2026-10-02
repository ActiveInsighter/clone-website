import type { ChartAxis, ChartPoint, ChartSeries } from "./types"

/** Reject values a numeric/logarithmic scale cannot represent without changing data. */
export function isChartPointValid(point: ChartPoint, xAxis: ChartAxis, yAxis: ChartAxis): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y)
    && (xAxis.scale !== "log" || point.x > 0)
    && (yAxis.scale !== "log" || point.y > 0)
}

export function validateChartAxis(axis: ChartAxis): string | null {
  const [min, max] = axis.domain
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    return `${axis.label}: the domain must contain two increasing, finite numbers.`
  }
  if (axis.scale === "log" && min <= 0) {
    return `${axis.label}: a logarithmic domain must be strictly positive.`
  }
  return null
}

export function getChartTicks(axis: ChartAxis): number[] {
  const [min, max] = axis.domain
  return [...new Set(axis.ticks)].filter((value) => Number.isFinite(value)
    && value >= min && value <= max && (axis.scale !== "log" || value > 0))
}

export function getChartSeries(series: readonly ChartSeries[], xAxis: ChartAxis, yAxis: ChartAxis): ChartSeries[] {
  return series.map((item) => ({
    ...item,
    points: item.points.filter((point) => isChartPointValid(point, xAxis, yAxis)),
  }))
}

/** Percent values are percentage points (38.5 means 38.5%), never normalized. */
export function formatChartValue(value: number, axis: Pick<ChartAxis, "format">, tick = false): string {
  const number = value.toLocaleString("en-US", { maximumFractionDigits: tick ? 4 : 12 })
  if (tick) return number
  if (axis.format === "percent") return `${number}%`
  if (axis.format === "currency") return `$${number}`
  return number
}
