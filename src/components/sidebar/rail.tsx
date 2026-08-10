"use client"

import * as React from "react"

import { useSidebarShellLabel } from "./shell"
import { SidebarTooltip } from "./tooltip"

export const SidebarRail = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(function SidebarRail(props, forwardedRef) {
  const label = useSidebarShellLabel()
  return (
    <nav
      {...props}
      ref={forwardedRef}
      data-slot="sidebar-rail"
      aria-label={
        props["aria-label"] ?? (label ? `${label} compact` : undefined)
      }
    />
  )
})

export const SidebarRailHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarRailHeader(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-rail-header" {...props} />
})

export const SidebarRailMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarRailMenu(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-rail-menu" {...props} />
})

export const SidebarRailFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarRailFooter(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-rail-footer" {...props} />
})

export type SidebarRailButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  active?: boolean
  icon?: React.ReactNode
  tooltip?: React.ReactNode
}

export const SidebarRailButton = React.forwardRef<
  HTMLButtonElement,
  SidebarRailButtonProps
>(function SidebarRailButton(
  {
    active = false,
    icon,
    tooltip,
    type = "button",
    children,
    ...props
  },
  forwardedRef,
) {
  const button = (
    <button
      ref={forwardedRef}
      type={type}
      data-slot="sidebar-rail-button"
      data-sidebar-rail-button=""
      data-active={active || undefined}
      aria-label={
        props["aria-label"] ??
        (typeof tooltip === "string" ? tooltip : undefined)
      }
      {...props}
    >
      {icon ?? children}
    </button>
  )

  return (
    <SidebarTooltip content={tooltip} side="right">
      {button}
    </SidebarTooltip>
  )
})
