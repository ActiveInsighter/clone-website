import type * as React from "react"

export type SidebarInteractivePropsOptions = {
  render?: unknown
  nativeButton?: boolean
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
  disabled?: boolean
  tabIndex?: number
}

export type SidebarResolvedInteractiveProps = {
  nativeButton: boolean
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] | undefined
  disabled: boolean | undefined
  ariaDisabled: true | undefined
  tabIndex: number | undefined
}

export function resolveSidebarInteractiveProps(
  options: SidebarInteractivePropsOptions,
): SidebarResolvedInteractiveProps {
  const { nativeButton, type, disabled = false, tabIndex } = options
  const resolvedNativeButton = nativeButton ?? true

  return {
    nativeButton: resolvedNativeButton,
    type: resolvedNativeButton ? (type ?? "button") : undefined,
    disabled: resolvedNativeButton ? disabled : undefined,
    ariaDisabled: !resolvedNativeButton && disabled ? true : undefined,
    tabIndex: !resolvedNativeButton && disabled ? -1 : tabIndex,
  }
}
