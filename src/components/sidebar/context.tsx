"use client"

import * as React from "react"
import { Tooltip } from "@base-ui/react/tooltip"

import {
  reduceSidebarModifierState,
  reduceSidebarPresentationState,
  serializeSidebarCookie,
  shouldHandleSidebarShortcut,
  type SidebarModifierAction,
  type SidebarModifierState,
  type SidebarPresentationState,
  type SidebarShortcutEvent,
  type SidebarTargetDescriptor,
} from "./state"
import {
  createSidebarTokenStyle,
  pickSidebarTokenStyle,
  SIDEBAR_MOBILE_QUERY,
} from "./tokens"
import type {
  SidebarPublicContextValue,
  SidebarRootProps,
  SidebarStyle,
  SidebarSurface,
} from "./types"

type SidebarInternalContextValue = SidebarPublicContextValue & {
  panelId: string
  railId: string
  mobilePopupId: string
  portalStyle: SidebarStyle
  getLastTrigger: () => HTMLElement | null
  registerSurface: (surface: Exclude<SidebarSurface, "external">, node: HTMLElement | null) => void
  registerTrigger: (surface: SidebarSurface, node: HTMLElement | null) => void
}

const SidebarContext = React.createContext<SidebarInternalContextValue | null>(
  null,
)

const DEFAULT_PERSISTENCE = { name: "sidebar_state" } as const

function getTargetDescriptor(target: EventTarget | null): SidebarTargetDescriptor {
  if (!(target instanceof Element)) return {}

  const editableAncestor = target.closest(
    "[contenteditable]:not([contenteditable='false'])",
  )

  return {
    tagName: target.tagName,
    isContentEditable:
      target instanceof HTMLElement ? target.isContentEditable : false,
    hasEditableAncestor: editableAncestor !== null,
  }
}

function toShortcutEvent(event: KeyboardEvent): SidebarShortcutEvent {
  return {
    key: event.key,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
    repeat: event.repeat,
    isComposing: event.isComposing,
    defaultPrevented: event.defaultPrevented,
  }
}

function toModifierAction(event: KeyboardEvent): SidebarModifierAction {
  return {
    type: "keyboard",
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
  }
}

export function SidebarRoot({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  mobileOpen: mobileOpenProp,
  defaultMobileOpen = false,
  onMobileOpenChange,
  shortcutKey = "b",
  persistence = DEFAULT_PERSISTENCE,
  tokens,
  style,
  className,
  children,
  ...props
}: SidebarRootProps) {
  const [presentationState, dispatchPresentation] = React.useReducer(
    reduceSidebarPresentationState,
    {
      desktopOpen: defaultOpen,
      mobileOpen: defaultMobileOpen,
    } satisfies SidebarPresentationState,
  )
  const open = openProp ?? presentationState.desktopOpen
  const mobileOpen = mobileOpenProp ?? presentationState.mobileOpen
  const [isMobile, setIsMobile] = React.useState(false)
  const [modifierState, setModifierState] = React.useState<SidebarModifierState>(
    { modifierHeld: false },
  )
  const panelId = React.useId()
  const railId = React.useId()
  const mobilePopupId = React.useId()
  const panelRef = React.useRef<HTMLElement | null>(null)
  const railRef = React.useRef<HTMLElement | null>(null)
  const panelTriggerRef = React.useRef<HTMLElement | null>(null)
  const railTriggerRef = React.useRef<HTMLElement | null>(null)
  const externalTriggerRef = React.useRef<HTMLElement | null>(null)
  const lastTriggerRef = React.useRef<HTMLElement | null>(null)
  const pendingFocusRef = React.useRef<"panel" | "rail" | null>(null)

  const tokenStyle = React.useMemo(
    () => createSidebarTokenStyle(tokens),
    [tokens],
  )
  const portalStyle = React.useMemo<SidebarStyle>(
    () => ({
      ...tokenStyle,
      ...pickSidebarTokenStyle(style),
    }),
    [style, tokenStyle],
  )

  React.useEffect(() => {
    const media = window.matchMedia(SIDEBAR_MOBILE_QUERY)
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    if (!persistence) return
    document.cookie = serializeSidebarCookie(persistence.name, open, persistence)
  }, [open, persistence])

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === open) return

      const activeElement = document.activeElement
      if (
        activeElement instanceof HTMLElement &&
        (nextOpen
          ? railRef.current?.contains(activeElement)
          : panelRef.current?.contains(activeElement))
      ) {
        pendingFocusRef.current = nextOpen ? "panel" : "rail"
      }

      if (openProp === undefined) {
        dispatchPresentation({ type: "set-desktop-open", open: nextOpen })
      }
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open, openProp],
  )

  const setMobileOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === mobileOpen) return
      if (mobileOpenProp === undefined) {
        dispatchPresentation({ type: "set-mobile-open", open: nextOpen })
      }
      onMobileOpenChange?.(nextOpen)
    },
    [mobileOpen, mobileOpenProp, onMobileOpenChange],
  )

  const toggle = React.useCallback(() => {
    const mobile = window.matchMedia(SIDEBAR_MOBILE_QUERY).matches
    if (mobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setOpen(!open)
    }
  }, [mobileOpen, open, setMobileOpen, setOpen])

  React.useLayoutEffect(() => {
    const pendingSurface = pendingFocusRef.current
    if (!pendingSurface) return

    const target =
      pendingSurface === "panel"
        ? panelTriggerRef.current
        : railTriggerRef.current
    if (target) {
      target.focus({ preventScroll: true })
      pendingFocusRef.current = null
    }
  }, [open])

  React.useEffect(() => {
    const updateModifier = (action: SidebarModifierAction) => {
      setModifierState((current) =>
        reduceSidebarModifierState(current, action),
      )
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      updateModifier(toModifierAction(event))
      if (
        shortcutKey &&
        shouldHandleSidebarShortcut(
          toShortcutEvent(event),
          shortcutKey,
          getTargetDescriptor(event.target),
        )
      ) {
        event.preventDefault()
        toggle()
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      updateModifier(toModifierAction(event))
    }
    const handleWindowBlur = () =>
      updateModifier({ type: "window-blur" })
    const handlePageHide = () => updateModifier({ type: "page-hide" })
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        updateModifier({ type: "visibility-hidden" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("pagehide", handlePageHide)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("pagehide", handlePageHide)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [shortcutKey, toggle])

  const registerSurface = React.useCallback(
    (surface: "panel" | "rail", node: HTMLElement | null) => {
      if (surface === "panel") panelRef.current = node
      else railRef.current = node
    },
    [],
  )

  const registerTrigger = React.useCallback(
    (surface: SidebarSurface, node: HTMLElement | null) => {
      const triggerRef =
        surface === "panel"
          ? panelTriggerRef
          : surface === "rail"
            ? railTriggerRef
            : externalTriggerRef
      if (!node && lastTriggerRef.current === triggerRef.current) {
        lastTriggerRef.current = null
      }
      triggerRef.current = node
      if (node) lastTriggerRef.current = node
    },
    [],
  )

  const getLastTrigger = React.useCallback(
    () => lastTriggerRef.current,
    [],
  )

  const contextValue = React.useMemo<SidebarInternalContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      mobileOpen,
      isMobile,
      modifierHeld: modifierState.modifierHeld,
      setOpen,
      setMobileOpen,
      toggle,
      panelId,
      railId,
      mobilePopupId,
      portalStyle,
      getLastTrigger,
      registerSurface,
      registerTrigger,
    }),
    [
      open,
      mobileOpen,
      isMobile,
      modifierState.modifierHeld,
      setOpen,
      setMobileOpen,
      toggle,
      panelId,
      railId,
      mobilePopupId,
      portalStyle,
      getLastTrigger,
      registerSurface,
      registerTrigger,
    ],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <Tooltip.Provider delay={400}>
        <div
          {...props}
          data-slot="sidebar-root"
          data-state={open ? "expanded" : "collapsed"}
          className={className}
          style={{ ...tokenStyle, ...style }}
        >
          {children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarPublicContextValue {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarRoot")
  }

  return context
}

export function useSidebarContext(): SidebarInternalContextValue {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar components must be used within SidebarRoot")
  }

  return context
}
