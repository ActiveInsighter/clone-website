"use client"

import { useId } from "react"
import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { formatChartValue, getChartTicks, validateChartAxis } from "./chart-data"
import { useEvidenceChartMotion } from "./cost-performance-chart"
import type { ChartAxis } from "./types"

export interface BenchmarkBarDatum {
  id: string
  label: string
  value: number
  color?: string
  highlight?: boolean
}

export interface BenchmarkBarChartProps {
  title: string
  subtitle?: string
  data: readonly BenchmarkBarDatum[]
  valueAxis: ChartAxis
  valueLabel?: string
  note?: ReactNode
  animated?: boolean
  className?: string
}

/** A categorical alternative for comparing caller-supplied benchmark values. */
export function BenchmarkBarChart({ title, subtitle, data, valueAxis, valueLabel, note, animated = true, className }: BenchmarkBarChartProps) {
  const id = useId()
  const rootRef = useEvidenceChartMotion(animated)
  const axisError = validateChartAxis(valueAxis)
  // Bars encode distance from zero. Logarithmic bars cannot honestly encode that distance.
  const validationError = axisError || (valueAxis.scale === "log" ? "Bar charts require a linear value axis; use CostPerformanceChart for logarithmic comparisons." : null)
  const cleanData = data.filter((item) => Number.isFinite(item.value))
  const config = { value: { label: valueLabel || valueAxis.label, color: "var(--evidence-orange)" } }
  return (
    <div ref={rootRef} className={cn("evidence-chart evidence-bar-chart", className)}>
      <Card className="evidence-chart-frame">
        <div className="evidence-chart-heading"><h3 id={`${id}-title`}>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <div className="evidence-chart-plot">
          {validationError ? <p className="evidence-chart-empty" role="status">Unable to display chart. {validationError}</p> : (
            <>
              <ChartContainer config={config} className="evidence-chart-container" initialDimension={{ width: 830, height: 480 }} aria-labelledby={`${id}-title`}>
                <BarChart layout="vertical" data={cleanData} margin={{ top: 24, bottom: 46, left: 0, right: 12 }} accessibilityLayer>
                  <CartesianGrid horizontal={false} stroke="var(--evidence-grid)" />
                  <XAxis type="number" domain={[...valueAxis.domain]} ticks={getChartTicks(valueAxis)} allowDataOverflow tickLine={false} axisLine={{ stroke: "var(--evidence-muted)" }} tickFormatter={(value: number) => formatChartValue(value, valueAxis, true)} label={{ value: valueLabel || valueAxis.label, position: "bottom", offset: 25, className: "evidence-chart-axis-label" }} />
                  <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={96} tickMargin={12} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent className="evidence-chart-tooltip" hideIndicator labelKey="label" formatter={(value, _name, item) => <div className="evidence-bar-tooltip"><span>{item.payload?.label}</span><strong>{typeof value === "number" ? formatChartValue(value, valueAxis) : String(value)}</strong></div>} />} />
                  <Bar dataKey="value" barSize={32} isAnimationActive={false}>
                    {cleanData.map((item) => <Cell key={item.id} fill={item.color || (item.highlight ? "var(--evidence-orange)" : "var(--evidence-gray-light)" )} stroke="var(--evidence-ink)" strokeWidth={1} />)}
                  </Bar>
                </BarChart>
              </ChartContainer>
              {!cleanData.length && <p className="evidence-chart-empty" role="status">No chart data available.</p>}
            </>
          )}
        </div>
        {cleanData.length !== data.length && <p className="evidence-chart-warning" role="status">Non-finite values are excluded from the plot.</p>}
      </Card>
      {note && <div className="evidence-chart-note">{note}</div>}
      <Collapsible className="evidence-chart-data">
        <CollapsibleTrigger className="evidence-chart-data-trigger">View chart data<span aria-hidden="true"> +</span></CollapsibleTrigger>
        <CollapsibleContent className="evidence-chart-data-panel">
          <div className="evidence-chart-data-scroll" tabIndex={0}>
            <table><caption>{title} — exact values</caption><thead><tr><th scope="col">Model</th><th scope="col">{valueLabel || valueAxis.label}</th></tr></thead><tbody>
              {data.map((item) => <tr key={item.id}><th scope="row">{item.label}</th><td>{formatChartValue(item.value, valueAxis)}</td></tr>)}
            </tbody></table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
