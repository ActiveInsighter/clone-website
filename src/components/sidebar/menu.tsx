"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"

import { useSidebarContext } from "./context"
import { SidebarTooltip } from "./tooltip"

type SidebarMenuItemContextValue = {
  active: boolean
}

const SidebarMenuItemContext = React.createContext<SidebarMenuItemContextValue>(
  { active: false },
)

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(function SidebarMenu(props, forwardedRef) {
  return <ul ref={forwardedRef} data-slot="sidebar-menu" {...props} />
})
export type SidebarMenuItemProps = React.ComponentPropsWithoutRef<"li"> & {
  active?: boolean
}

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuItemProps
>(function SidebarMenuItem(
  { active = false, children, ...props },
  forwardedRef,
) {
  const value = React.useMemo(() => ({ active }), [active])

  return (
    <SidebarMenuItemContext.Provider value={value}>
      <li
        ref={forwardedRef}
        data-slot="sidebar-menu-item"
        data-active={active || undefined}
        {...props}
      >
        {children}
      </li>
    </SidebarMenuItemContext.Provider>
  )
})

export type SidebarMenuButtonState = {
  active: boolean
  disabled: boolean
}

export type SidebarMenuButtonProps = Omit<
  useRender.ComponentProps<"button", SidebarMenuButtonState>,
  "children" | "ref"
> & {
  icon?: React.ReactNode
  trailing?: React.ReactNode
  children: React.ReactNode
}

export const SidebarMenuButton = React.forwardRef<
  HTMLElement,
  SidebarMenuButtonProps
>(function SidebarMenuButton(
  {
    render,
    icon,
    trailing,
    children,
    disabled = false,
    type,
    onClick,
    ...props
  },
  forwardedRef,
) {
  const { active } = React.useContext(SidebarMenuItemContext)
  const state = React.useMemo(
    () => ({ active, disabled: Boolean(disabled) }),
    [active, disabled],
  )

  return useRender<SidebarMenuButtonState, HTMLElement>({
    defaultTagName: "button",
    render,
    ref: forwardedRef,
    state,
    stateAttributesMapping: {
      active: (value) => (value ? { "data-active": "" } : null),
      disabled: (value) => (value ? { "data-disabled": "" } : null),
    },
    props: {
      ...props,
      type: render ? undefined : (type ?? "button"),
      disabled: render ? undefined : disabled,
      "aria-disabled": render && disabled ? true : undefined,
      tabIndex: render && disabled ? -1 : props.tabIndex,
      "data-slot": "sidebar-menu-button",
      "data-has-icon": icon ? "" : undefined,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event as React.MouseEvent<HTMLButtonElement>)
      },
      children: (
        <>
          {icon ? (
            <span data-slot="sidebar-menu-icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span data-slot="sidebar-menu-label">{children}</span>
          {trailing ? (
            <span data-slot="sidebar-menu-trailing">{trailing}</span>
          ) : null}
        </>
      ),
    },
  })
})

export const SidebarMenuActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function SidebarMenuActions(props, forwardedRef) {
  return <div ref={forwardedRef} data-slot="sidebar-menu-actions" {...props} />
})

export type SidebarMenuActionProps = React.ComponentPropsWithoutRef<"button"> & {
  tooltip?: React.ReactNode
}

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuActionProps
>(function SidebarMenuAction(
  { tooltip, type = "button", children, ...props },
  forwardedRef,
) {
  const button = (
    <button
      ref={forwardedRef}
      type={type}
      data-slot="sidebar-menu-action"
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

export type SidebarShortcutHintProps = Omit<
  React.ComponentPropsWithoutRef<"kbd">,
  "children"
> & {
  keys: readonly React.ReactNode[]
  primaryKey?: React.ReactNode
  separator?: React.ReactNode
}

export const SidebarShortcutHint = React.forwardRef<
  HTMLElement,
  SidebarShortcutHintProps
>(function SidebarShortcutHint(
  { keys, primaryKey = "Ctrl", separator = "+", ...props },
  forwardedRef,
) {
  const { modifierHeld } = useSidebarContext()
  const displayKeys = [primaryKey, ...keys]

  return (
    <kbd
      ref={forwardedRef}
      data-slot="sidebar-shortcut-hint"
      data-visible={modifierHeld || undefined}
      aria-hidden={!modifierHeld}
      {...props}
    >
      {displayKeys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <span aria-hidden="true">{separator}</span> : null}
          <span>{key}</span>
        </React.Fragment>
      ))}
    </kbd>
  )
})
