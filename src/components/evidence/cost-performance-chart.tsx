"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"
import type { TooltipContentProps, TooltipValueType } from "recharts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { formatChartValue, getChartSeries, getChartTicks, validateChartAxis } from "./chart-data"
import type { ChartAxis, ChartPoint, ChartSeries, CostPerformanceChartProps } from "./types"
import "./evidence-theme.css"
import "./chart.css"

/** Draw only after visibility is established. Server HTML remains fully visible. */
export function useEvidenceChartMotion(animated: boolean) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  useEffect(() => {
    const root = rootRef.current
    if (!root || !animated || hasAnimated.current || !window.IntersectionObserver) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (preference.matches) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      hasAnimated.current = true
      root.dataset.motion = "draw"
      observer.disconnect()
    }, { threshold: 0.15 })
    observer.observe(root)
    const stopMotion = () => {
      if (preference.matches) {
        observer.disconnect()
        delete root.dataset.motion
      }
    }
    const finishDrawing = () => { root.dataset.motion = "complete" }
    root.addEventListener("animationend", finishDrawing)
    preference.addEventListener("change", stopMotion)
    return () => {
      observer.disconnect()
      root.removeEventListener("animationend", finishDrawing)
      preference.removeEventListener("change", stopMotion)
    }
  }, [animated])
  return rootRef
}

function useCompactChart() {
  const ref = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    if (!ref.current || !window.ResizeObserver) return
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 520))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, compact }
}

function ScatterLine({ points, stroke }: { points?: readonly { x: number | null; y: number | null }[]; stroke?: string }) {
  const path = points?.reduce((result, point, index) => {
    if (point.x === null || point.y === null) return result
    return `${result}${index === 0 || !result ? "M" : "L"}${point.x},${point.y}`
  }, "")
  return <path d={path} pathLength={1} fill="none" stroke={stroke} strokeWidth={2} />
}

interface PointShapeProps {
  cx?: number
  cy?: number
  payload?: ChartPoint
  fill?: string
}

function PointShape({ cx, cy, payload, fill }: PointShapeProps) {
  if (cx === undefined || cy === undefined || !payload) return <g />
  return (
    <g className="evidence-chart-point">
      <circle cx={cx} cy={cy} r={7} fill={fill} stroke="var(--evidence-ink)" strokeWidth={1} />
      {payload.label && payload.labelPlacement !== "hidden" && (
        <text x={cx} y={cy + (payload.labelPlacement === "below" ? 24 : -14)} textAnchor="middle" className="evidence-chart-effort">
          {payload.label}
        </text>
      )}
    </g>
  )
}

function pointFromPayload(value: unknown): (ChartPoint & { model: string }) | null {
  if (!value || typeof value !== "object" || !("x" in value) || !("y" in value) || !("model" in value)) return null
  if (typeof value.x !== "number" || typeof value.y !== "number" || typeof value.model !== "string") return null
  return {
    x: value.x,
    y: value.y,
    model: value.model,
    label: "label" in value && typeof value.label === "string" ? value.label : undefined,
  }
}

function CostTooltip({ active, payload, xAxis, yAxis }: Pick<TooltipContentProps<TooltipValueType, number | string>, "active" | "payload"> & { xAxis: ChartAxis; yAxis: ChartAxis }) {
  const point = pointFromPayload(payload?.[0]?.payload)
  if (!active || !point) return null
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      hideLabel
      hideIndicator
      className="evidence-chart-tooltip"
      formatter={(_value, _name, _item, index) => index === 0 ? (
        <div className="evidence-chart-tooltip-content">
          <strong>{point.model}</strong>
          <dl>
            <div><dt>{xAxis.label}</dt><dd>{formatChartValue(point.x, xAxis)}</dd></div>
            <div><dt>{yAxis.label}</dt><dd>{formatChartValue(point.y, yAxis)}</dd></div>
            {point.label && <div><dt>Effort</dt><dd>{point.label}</dd></div>}
          </dl>
        </div>
      ) : null}
    />
  )
}

function ChartDataTable({ title, series, xAxis, yAxis }: { title: string; series: readonly ChartSeries[]; xAxis: ChartAxis; yAxis: ChartAxis }) {
  return (
    <Collapsible className="evidence-chart-data">
      <CollapsibleTrigger className="evidence-chart-data-trigger">View chart data<span aria-hidden="true"> +</span></CollapsibleTrigger>
      <CollapsibleContent className="evidence-chart-data-panel">
        <div className="evidence-chart-data-scroll" tabIndex={0}>
          <table>
            <caption>{title} — exact values for all series</caption>
            <thead><tr><th scope="col">Model</th><th scope="col">Effort</th><th scope="col">{xAxis.label}</th><th scope="col">{yAxis.label}</th></tr></thead>
            <tbody>
              {series.flatMap((item) => item.points.map((point, index) => (
                <tr key={`${item.id}-${index}`}><th scope="row">{item.label}</th><td>{point.label || "—"}</td><td>{formatChartValue(point.x, xAxis)}</td><td>{formatChartValue(point.y, yAxis)}</td></tr>
              )))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function CostPerformanceChart({ title, subtitle, series, xAxis, yAxis, note, animated = true, className }: CostPerformanceChartProps) {
  const id = useId()
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set())
  const rootRef = useEvidenceChartMotion(animated)
  const { ref, compact } = useCompactChart()
  const cleanSeries = useMemo(() => getChartSeries(series, xAxis, yAxis), [series, xAxis, yAxis])
  const config = useMemo<ChartConfig>(() => Object.fromEntries(cleanSeries.map((item, index) => [`series${index}`, { label: item.label, color: item.color }])), [cleanSeries])
  const validationError = validateChartAxis(xAxis) || validateChartAxis(yAxis)
  const visiblePoints = cleanSeries.some((item) => !hidden.has(item.id) && item.points.length > 0)
  const invalidPoints = cleanSeries.reduce((sum, item, index) => sum + series[index].points.length - item.points.length, 0)
  function toggleSeries(seriesId: string) {
    setHidden((previous) => {
      const next = new Set(previous)
      if (next.has(seriesId)) next.delete(seriesId)
      else next.add(seriesId)
      return next
    })
  }
  return (
    <div className={cn("evidence-chart", className)} ref={rootRef}>
      <Card className="evidence-chart-frame">
        <div className="evidence-chart-heading"><h3 id={`${id}-title`}>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <div className="evidence-chart-legend" role="group" aria-label={`${title}: visible models`}>
          {cleanSeries.map((item) => (
            <Button key={item.id} variant="ghost" size="sm" className="evidence-chart-legend-button" aria-pressed={!hidden.has(item.id)} onClick={() => toggleSeries(item.id)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx={8} cy={8} r={6.5} fill={item.color} stroke="var(--evidence-ink)" strokeWidth={1} /></svg>
              {item.label}
            </Button>
          ))}
        </div>
        <div className="evidence-chart-plot" ref={ref}>
          {validationError ? <p className="evidence-chart-empty" role="status">Unable to display chart. {validationError}</p> : (
            <>
              <ChartContainer config={config} className="evidence-chart-container" initialDimension={{ width: 830, height: 480 }} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
                <ScatterChart margin={{ top: 30, right: compact ? 10 : 12, bottom: 46, left: compact ? 0 : 16 }} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="var(--evidence-grid)" strokeWidth={1} />
                  <XAxis type="number" dataKey="x" name={xAxis.label} domain={[...xAxis.domain]} ticks={getChartTicks(xAxis)} scale={xAxis.scale || "linear"} allowDataOverflow tickLine={false} axisLine={{ stroke: "var(--evidence-muted)" }} tickMargin={12} tickFormatter={(value: number) => formatChartValue(value, xAxis, true)} label={{ value: xAxis.label, position: "bottom", offset: 25, className: "evidence-chart-axis-label" }} />
                  <YAxis type="number" dataKey="y" name={yAxis.label} domain={[...yAxis.domain]} ticks={getChartTicks(yAxis)} scale={yAxis.scale || "linear"} allowDataOverflow tickLine={false} axisLine={{ stroke: "var(--evidence-muted)" }} tickMargin={10} width={compact ? 42 : 58} tickFormatter={(value: number) => formatChartValue(value, yAxis, true)} label={{ value: yAxis.label, angle: -90, position: "insideLeft", offset: compact ? 8 : 0, className: "evidence-chart-axis-label" }} />
                  <ChartTooltip cursor={false} content={(props) => <CostTooltip {...props} xAxis={xAxis} yAxis={yAxis} />} />
                  {[...cleanSeries].reverse().map((item) => (
                    <Scatter key={item.id} name={item.label} data={item.points.map((point) => ({ ...point, model: item.label }))} fill={item.color} stroke={item.color} hide={hidden.has(item.id)} line={<ScatterLine />} lineType="joint" lineJointType="linear" shape={<PointShape />} isAnimationActive={false} />
                  ))}
                </ScatterChart>
              </ChartContainer>
              {!visiblePoints && <p className="evidence-chart-empty" role="status">{cleanSeries.some((item) => item.points.length) ? "Choose a model in the legend to display its results." : "No chart data available."}</p>}
            </>
          )}
        </div>
        <p id={`${id}-description`} className="sr-only">{title}. {xAxis.label}, {xAxis.scale === "log" ? "logarithmic" : "linear"} scale. {yAxis.label}, {yAxis.scale === "log" ? "logarithmic" : "linear"} scale. Toggle models using the legend, or open View chart data for exact values.</p>
        {invalidPoints > 0 && <p className="evidence-chart-warning" role="status">{invalidPoints} non-finite or non-positive logarithmic {invalidPoints === 1 ? "point is" : "points are"} excluded from the plot.</p>}
      </Card>
      {note && <div className="evidence-chart-note">{note}</div>}
      <ChartDataTable title={title} series={series} xAxis={xAxis} yAxis={yAxis} />
    </div>
  )
}
