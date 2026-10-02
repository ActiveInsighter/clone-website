"use client"

import { useState } from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { RichText } from "./rich-text"
import type { Testimonial, TestimonialTabsProps } from "./types"

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <Card className="evidence-testimonial__card">
      <CardContent className="evidence-testimonial__content">
        <span className="evidence-testimonial__caption">Quote</span>
        <blockquote className="evidence-testimonial__quote">
          <RichText blocks={item.quote} />
        </blockquote>
      </CardContent>
      <CardFooter className="evidence-testimonial__footer">
        <div className="evidence-testimonial__metadata">
          <span className="evidence-testimonial__caption">Company</span>
          <span>{item.company}</span>
        </div>
        <div className="evidence-testimonial__metadata">
          <span className="evidence-testimonial__caption">Author</span>
          <span>{item.author}{item.role ? `, ${item.role}` : ""}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export function TestimonialTabs({ items, label = "Customer perspectives", className }: TestimonialTabsProps) {
  const [selected, setSelected] = useState(items[0]?.id ?? "")
  const active = items.some((item) => item.id === selected) ? selected : items[0]?.id ?? ""
  const index = items.findIndex((item) => item.id === active)
  const next = items.length > 1 ? items[(index + 1) % items.length] : undefined

  if (!items.length) return <div className={cn("evidence-testimonials evidence-widget-empty", className)}>No perspectives available.</div>

  return (
    <Tabs value={active} onValueChange={(value) => { if (typeof value === "string") setSelected(value) }} className={cn("evidence-testimonials", className)}>
      <TabsList variant="line" aria-label={label} className="evidence-editorial-tabs">
        {items.map((item) => <TabsTrigger key={item.id} value={item.id} className="evidence-editorial-tab">{item.company}</TabsTrigger>)}
      </TabsList>
      <div className="evidence-testimonials__stage">
        {items.map((item) => (
          <TabsContent key={item.id} value={item.id} className="evidence-testimonials__panel">
            <QuoteCard item={item} />
          </TabsContent>
        ))}
        {next && <div className="evidence-testimonials__peek" aria-hidden="true" inert><QuoteCard item={next} /></div>}
      </div>
    </Tabs>
  )
}
