"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CostPerformanceChart } from "./cost-performance-chart"
import type { ChartTab } from "./types"

export function ChartTabs({ tabs, className }: { tabs: readonly ChartTab[]; className?: string }) {
  const [selected, setSelected] = useState(tabs[0]?.id ?? "")
  const active = tabs.some(tab => tab.id === selected) ? selected : tabs[0]?.id ?? ""
  if (!tabs.length) return null
  return (
    <Tabs value={active} onValueChange={(value) => { if (typeof value === "string") setSelected(value) }} className={cn("evidence-chart-tabs", className)}>
      <div className="evidence-chart-tab-scroll">
        <TabsList activateOnFocus variant="line" className="evidence-chart-tab-list" aria-label="Benchmarks">
          {tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="evidence-chart-tab">{tab.label}</TabsTrigger>)}
        </TabsList>
      </div>
      <div className="evidence-chart-tab-panels">
      {tabs.map((tab) => (
        <TabsContent keepMounted hidden={false} aria-hidden={tab.id !== active} key={tab.id} value={tab.id} className="evidence-chart-tab-panel">
          <CostPerformanceChart {...tab.chart} animated={tab.id === active && tab.chart.animated !== false} />
        </TabsContent>
      ))}
      </div>
    </Tabs>
  )
}
