"use client"

import * as React from "react"
import { Tooltip } from "@base-ui/react/tooltip"

import { useSidebarContext } from "./context"

export type SidebarTooltipProps = {
  content?: React.ReactNode
  side?: Tooltip.Positioner.Props["side"]
  align?: Tooltip.Positioner.Props["align"]
  sideOffset?: number
  disabled?: boolean
  children: React.ReactElement
}
export function SidebarTooltip({
  content,
  side = "right",
  align = "center",
  sideOffset = 8,
  disabled = false,
  children,
}: SidebarTooltipProps) {
  const { portalStyle } = useSidebarContext()

  if (!content) return children

  return (
    <Tooltip.Root disabled={disabled}>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner
          data-slot="sidebar-tooltip-positioner"
          data-sidebar-portal-surface=""
          side={side}
          align={align}
          sideOffset={sideOffset}
          style={portalStyle}
        >
          <Tooltip.Popup data-slot="sidebar-tooltip" style={portalStyle}>
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
