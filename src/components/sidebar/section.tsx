"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"

export type SidebarSectionProps = Omit<
  React.ComponentPropsWithoutRef<"section">,
  "onChange"
> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export function SidebarSection({
  open,
  defaultOpen = true,
  onOpenChange,
  disabled,
  children,
  ...props
}: SidebarSectionProps) {
  return (
    <Collapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      render={<section data-slot="sidebar-section" {...props} />}
    >
      {children}
    </Collapsible.Root>
  )
}

export const SidebarSectionHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarSectionHeader(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-section-header" {...props} />
})
export const SidebarSectionTrigger = React.forwardRef<
  HTMLButtonElement,
  Collapsible.Trigger.Props
>(function SidebarSectionTrigger({ children, ...props }, forwardedRef) {
  return (
    <Collapsible.Trigger
      ref={forwardedRef}
      data-slot="sidebar-section-trigger"
      {...props}
    >
      <svg
        data-slot="sidebar-section-chevron"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          d="m5.5 7.8 4.5 4.4 4.5-4.4"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </Collapsible.Trigger>
  )
})

export const SidebarSectionLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarSectionLabel(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-section-label" {...props} />
})

export const SidebarSectionActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarSectionActions(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-section-actions" {...props} />
})

export const SidebarSectionContent = React.forwardRef<
  HTMLDivElement,
  Collapsible.Panel.Props
>(function SidebarSectionContent(
  { keepMounted = true, ...props },
  forwardedRef,
) {
  return (
    <Collapsible.Panel
      ref={forwardedRef}
      keepMounted={keepMounted}
      data-slot="sidebar-section-content"
      {...props}
    />
  )
})
