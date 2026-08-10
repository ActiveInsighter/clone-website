"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"

import { useSidebarContext } from "./context"
import {
  SidebarFixedTop,
  SidebarFooter,
  SidebarHeader,
  SidebarScrollArea,
} from "./layout"
import type { SidebarShellProps } from "./types"

const SidebarShellLabelContext = React.createContext<string | null>(null)

export function useSidebarShellLabel() {
  return React.useContext(SidebarShellLabelContext)
}

export const SidebarShell = React.forwardRef<HTMLElement, SidebarShellProps>(
  function SidebarShell(
    {
      side = "left",
      label,
      rail,
      children,
      className,
      overlayClassName,
      popupClassName,
      ...props
    },
    forwardedRef,
  ) {
    const context = useSidebarContext()

    if (context.isMobile) {
      return (
        <SidebarShellLabelContext.Provider value={label}>
          <Dialog.Root
            open={context.mobileOpen}
            onOpenChange={context.setMobileOpen}
          >
            <Dialog.Portal>
              <Dialog.Backdrop
                data-slot="sidebar-mobile-backdrop"
                data-sidebar-portal-surface=""
                className={overlayClassName}
                style={context.portalStyle}
              />
              <Dialog.Popup
                id={context.mobilePopupId}
                data-slot="sidebar-mobile-popup"
                data-sidebar-portal-surface=""
                data-side={side}
                className={popupClassName}
                style={context.portalStyle}
                finalFocus={context.getMobileFocusReturn}
              >
                <Dialog.Title className="sidebar-sr-only">{label}</Dialog.Title>
                <Dialog.Description className="sidebar-sr-only">
                  {label}
                </Dialog.Description>
                {children}
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </SidebarShellLabelContext.Provider>
      )
    }

    return (
      <SidebarShellLabelContext.Provider value={label}>
        <aside
          {...props}
          ref={forwardedRef}
          data-slot="sidebar-shell"
          data-side={side}
          data-state={context.state}
          aria-label={label}
          className={className}
        >
          <div
            ref={(node) => context.registerSurface("rail", node)}
            id={context.railId}
            data-slot="sidebar-desktop-layer"
            data-surface="rail"
            data-side={side}
            aria-hidden={context.open}
            inert={context.open || undefined}
          >
            {rail}
          </div>
          <div
            ref={(node) => context.registerSurface("panel", node)}
            data-slot="sidebar-desktop-layer"
            data-surface="panel"
            data-side={side}
            aria-hidden={!context.open}
            inert={!context.open || undefined}
          >
            {children}
          </div>
        </aside>
      </SidebarShellLabelContext.Provider>
    )
  },
)

type SidebarHeaderElement = React.ReactElement<
  React.ComponentProps<typeof SidebarHeader>,
  typeof SidebarHeader
>
type SidebarFixedTopElement = React.ReactElement<
  React.ComponentProps<typeof SidebarFixedTop>,
  typeof SidebarFixedTop
>
type SidebarScrollAreaElement = React.ReactElement<
  React.ComponentProps<typeof SidebarScrollArea>,
  typeof SidebarScrollArea
>
type SidebarFooterElement = React.ReactElement<
  React.ComponentProps<typeof SidebarFooter>,
  typeof SidebarFooter
>

export type SidebarPanelChildren =
  | readonly [
      SidebarHeaderElement,
      SidebarScrollAreaElement,
      SidebarFooterElement,
    ]
  | readonly [
      SidebarHeaderElement,
      SidebarFixedTopElement,
      SidebarScrollAreaElement,
      SidebarFooterElement,
    ]

export type SidebarPanelProps = Omit<
  React.ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  children: SidebarPanelChildren
}

const sidebarPanelRegionTypesWithFixedTop = [
  SidebarHeader,
  SidebarFixedTop,
  SidebarScrollArea,
  SidebarFooter,
] as const
const sidebarPanelRegionTypesWithoutFixedTop = [
  SidebarHeader,
  SidebarScrollArea,
  SidebarFooter,
] as const

export const SidebarPanel = React.forwardRef<HTMLElement, SidebarPanelProps>(
  function SidebarPanel({ children, ...props }, forwardedRef) {
    const { panelId } = useSidebarContext()
    const label = useSidebarShellLabel()
    const regions = React.Children.toArray(children)
    const expectedRegionTypes =
      regions.length === sidebarPanelRegionTypesWithoutFixedTop.length
        ? sidebarPanelRegionTypesWithoutFixedTop
        : sidebarPanelRegionTypesWithFixedTop

    if (
      regions.length !== expectedRegionTypes.length ||
      regions.some(
        (region, index) =>
          !React.isValidElement(region) ||
          region.type !== expectedRegionTypes[index],
      )
    ) {
      throw new Error(
        "SidebarPanel requires SidebarHeader, an optional SidebarFixedTop, one SidebarScrollArea, and SidebarFooter in that order.",
      )
    }

    return (
      <nav
        {...props}
        ref={forwardedRef}
        id={panelId}
        data-slot="sidebar-panel"
        aria-label={props["aria-label"] ?? label ?? undefined}
      >
        {children}
      </nav>
    )
  },
)

export const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"main">
>(function SidebarInset(props, forwardedRef) {
  return <main ref={forwardedRef} data-slot="sidebar-inset" {...props} />
})
