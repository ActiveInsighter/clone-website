"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"

import { useSidebarContext } from "./context"
import { SidebarTooltip } from "./tooltip"
import type { SidebarSurface } from "./types"

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

export type SidebarIconButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  tooltip?: React.ReactNode
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export const SidebarIconButton = React.forwardRef<
  HTMLButtonElement,
  SidebarIconButtonProps
>(function SidebarIconButton(
  { tooltip, tooltipSide = "right", type = "button", children, ...props },
  forwardedRef,
) {
  const button = (
    <button
      ref={forwardedRef}
      type={type}
      data-slot="sidebar-icon-button"
      data-sidebar-icon-button=""
      aria-label={
        props["aria-label"] ??
        (typeof tooltip === "string" ? tooltip : undefined)
      }
      {...props}
    >
      {children}
    </button>
  )

  return (
    <SidebarTooltip content={tooltip} side={tooltipSide}>
      {button}
    </SidebarTooltip>
  )
})

type SidebarTriggerState = {
  expanded: boolean
}

export type SidebarTriggerProps = Omit<
  useRender.ComponentProps<"button", SidebarTriggerState>,
  "ref"
> & {
  surface?: SidebarSurface
  tooltip?: React.ReactNode
  tooltipSide?: "top" | "right" | "bottom" | "left"
}

export const SidebarTrigger = React.forwardRef<
  HTMLElement,
  SidebarTriggerProps
>(function SidebarTrigger(
  {
    surface = "external",
    render,
    tooltip,
    tooltipSide = "right",
    onClick,
    children,
    type,
    disabled,
    ...props
  },
  forwardedRef,
) {
  const context = useSidebarContext()
  const expanded = context.isMobile ? context.mobileOpen : context.open
  const setTriggerRef = React.useCallback(
    (node: HTMLElement | null) => {
      assignRef(forwardedRef, node)
      context.registerTrigger(surface, node)
    },
    [context, forwardedRef, surface],
  )

  const trigger = useRender<SidebarTriggerState, HTMLElement>({
    defaultTagName: "button",
    render,
    ref: setTriggerRef,
    state: { expanded },
    stateAttributesMapping: {
      expanded: (value) => (value ? { "data-expanded": "" } : null),
    },
    props: {
      ...props,
      type: render ? undefined : (type ?? "button"),
      disabled: render ? undefined : disabled,
      "aria-disabled": render && disabled ? true : undefined,
      "data-slot": "sidebar-trigger",
      "data-sidebar-icon-button": "",
      "aria-label":
        props["aria-label"] ??
        (typeof tooltip === "string" ? tooltip : undefined),
      "aria-controls": context.isMobile
        ? context.mobilePopupId
        : context.panelId,
      "aria-expanded": expanded,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event as React.MouseEvent<HTMLButtonElement>)
        if (!event.defaultPrevented) context.toggle()
      },
      children: (
        <>
          {children ?? <span aria-hidden="true">☰</span>}
          <span className="sidebar-sr-only">Toggle sidebar</span>
        </>
      ),
    },
  })

  return (
    <SidebarTooltip content={tooltip} side={tooltipSide}>
      {trigger}
    </SidebarTooltip>
  )
})

export type SidebarSectionActionProps = React.ComponentPropsWithoutRef<"button"> & {
  tooltip?: React.ReactNode
}

export const SidebarSectionAction = React.forwardRef<
  HTMLButtonElement,
  SidebarSectionActionProps
>(function SidebarSectionAction(
  { tooltip, type = "button", children, ...props },
  forwardedRef,
) {
  const button = (
    <button
      ref={forwardedRef}
      type={type}
      data-slot="sidebar-section-action"
      aria-label={
        props["aria-label"] ??
        (typeof tooltip === "string" ? tooltip : undefined)
      }
      {...props}
    >
      {children}
    </button>
  )

  return (
    <SidebarTooltip content={tooltip} side="right">
      {button}
    </SidebarTooltip>
  )
})
