"use client"

import * as React from "react"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  matchesSidebarShortcut,
  readSidebarCookieState,
  serializeSidebarCookie,
} from "./state"

/* --------------------------------------------------------------------------
 * Constants & context
 * ------------------------------------------------------------------------ */

const CHAT_SIDEBAR_COOKIE_NAME = "chat_sidebar_state"
const CHAT_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const CHAT_SIDEBAR_KEYBOARD_SHORTCUT = "b"

type ChatSidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  sidebarWidth: string
  toggleSidebar: () => void
}

const ChatSidebarContext = React.createContext<ChatSidebarContextProps | null>(
  null
)

export function useChatSidebar() {
  const context = React.useContext(ChatSidebarContext)
  if (!context) {
    throw new Error(
      "useChatSidebar must be used within a ChatSidebarProvider."
    )
  }
  return context
}

/* --------------------------------------------------------------------------
 * ChatSidebarProvider
 *
 * Owns the open/collapsed state (desktop), the mobile drawer state, the
 * keyboard shortcut, cookie persistence, and the sizing/motion CSS variables
 * that every sub-component consumes. Override the CSS variables via props to
 * re-skin the sidebar for a different product without touching the internals.
 * ------------------------------------------------------------------------ */

export function ChatSidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  keyboardShortcut = CHAT_SIDEBAR_KEYBOARD_SHORTCUT,
  cookieName = CHAT_SIDEBAR_COOKIE_NAME,
  width = "260px",
  railWidth = "52px",
  headerHeight = "52px",
  duration = "250ms",
  easing = "cubic-bezier(0.32, 0.72, 0, 1)",
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Modifier key (⌘/Ctrl) + this key toggles the sidebar. `null` disables. */
  keyboardShortcut?: string | null
  cookieName?: string
  /** Expanded panel width, for example `260px`. */
  width?: string
  /** Collapsed icon-rail width, for example `52px`. */
  railWidth?: string
  /** Height of the sticky header row. */
  headerHeight?: string
  /** Width animation duration. ChatGPT uses a ~250ms JS spring. */
  duration?: string
  /** Width animation easing. Default approximates ChatGPT's spring. */
  easing?: string
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)

  React.useEffect(() => {
    if (openProp !== undefined) return
    const savedState = readSidebarCookieState(document.cookie, cookieName)
    if (savedState !== undefined) _setOpen(savedState)
  }, [openProp, cookieName])
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
        document.cookie = serializeSidebarCookie(
          cookieName,
          openState,
          CHAT_SIDEBAR_COOKIE_MAX_AGE,
        )
      }
    },
    [setOpenProp, open, cookieName]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    if (!keyboardShortcut) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (matchesSidebarShortcut(event, keyboardShortcut)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar, keyboardShortcut])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<ChatSidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarWidth: width,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, width]
  )

  return (
    <ChatSidebarContext.Provider value={contextValue}>
      <div
        data-slot="chat-sidebar-wrapper"
        style={
          {
            "--chat-sidebar-width": width,
            "--chat-sidebar-rail-width": railWidth,
            "--chat-sidebar-header-height": headerHeight,
            "--chat-sidebar-duration": duration,
            "--chat-sidebar-easing": easing,
            ...style,
          } as React.CSSProperties
        }
        className={cn("flex h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ChatSidebarContext.Provider>
  )
}

/* --------------------------------------------------------------------------
 * ChatSidebar
 *
 * The collapsible shell. Renders two stacked layers that cross-fade:
 *  - the icon rail (visible while collapsed, click background to expand)
 *  - the expanded panel (visible while expanded)
 * The shell's width animates between --chat-sidebar-width and
 * --chat-sidebar-rail-width. On mobile it renders as a Sheet drawer instead.
 * ------------------------------------------------------------------------ */

export function ChatSidebar({
  side = "left",
  rail,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  /** Content of the collapsed icon rail. Omit to collapse to zero width. */
  rail?: React.ReactNode
}) {
  const {
    isMobile,
    state,
    open,
    openMobile,
    setOpenMobile,
    setOpen,
    sidebarWidth,
  } = useChatSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          showCloseButton={false}
          overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-none"
          className="w-(--chat-sidebar-width) max-w-xs gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground shadow-[0_0_64px_0_rgba(0,0,0,0.07)] data-[side=left]:w-(--chat-sidebar-width) data-[side=right]:w-(--chat-sidebar-width)"
          style={{ width: sidebarWidth }}
          {...props}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the navigation sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-slot="chat-sidebar"
      data-state={state}
      data-side={side}
      className={cn(
        "group/chat-sidebar relative z-20 h-full shrink-0 overflow-hidden border-sidebar-border bg-sidebar text-sidebar-foreground max-md:hidden",
        side === "left" ? "border-e" : "border-s",
        className
      )}
      style={{
        width: open
          ? "var(--chat-sidebar-width)"
          : rail
            ? "var(--chat-sidebar-rail-width)"
            : "0px",
        transition:
          "width var(--chat-sidebar-duration) var(--chat-sidebar-easing)",
      }}
      {...props}
    >
      {/* Collapsed icon rail — cross-fades in when the panel collapses. */}
      {rail ? (
        <div
          data-slot="chat-sidebar-rail"
          aria-hidden={open}
          inert={open}
          onClick={() => setOpen(true)}
          className={cn(
            "absolute inset-0 z-10 cursor-e-resize transition-opacity duration-150 ease-linear",
            side === "right" && "cursor-w-resize",
            open
              ? "pointer-events-none opacity-0"
              : "pointer-events-auto opacity-100"
          )}
        >
          {rail}
        </div>
      ) : null}
      {/* Expanded panel — clipped by the shell while the width animates. */}
      <div
        data-slot="chat-sidebar-panel"
        aria-hidden={!open && !!rail}
        inert={!open && !!rail}
        className={cn(
          "flex h-full w-(--chat-sidebar-width) flex-col overflow-x-clip whitespace-nowrap transition-opacity duration-150 ease-linear",
          !open && rail ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
 * Panel layout regions
 * ------------------------------------------------------------------------ */

export function ChatSidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-sidebar-header"
      className={cn("shrink-0 bg-sidebar px-2", className)}
      {...props}
    >
      <div className="flex h-(--chat-sidebar-header-height) items-center justify-between">
        {children}
      </div>
    </div>
  )
}

export function ChatSidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-clip overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  )
}

export function ChatSidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-sidebar-footer"
      className={cn(
        "shrink-0 border-t border-sidebar-border-strong p-5",
        className
      )}
      {...props}
    />
  )
}

/* --------------------------------------------------------------------------
 * Sections, menus and menu buttons (expanded panel)
 * ------------------------------------------------------------------------ */

export function ChatSidebarSection({
  sticky = false,
  label,
  collapsible = false,
  defaultOpen = true,
  open,
  onOpenChange,
  action,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  /** Pin the section to the top of the scrolling content (e.g. "New chat"). */
  sticky?: boolean
  /** Optional generic group label. Supplying it enables the section header. */
  label?: React.ReactNode
  /** Turn the section into an accessible collapsible group. */
  collapsible?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Independent sibling action rendered at the end of the group header. */
  action?: React.ReactNode
}) {
  const sectionClassName = cn(
    "relative pt-2 [[data-slot=chat-sidebar-section]+&]:mt-3",
    sticky && "sticky top-0 z-10 bg-sidebar",
    className
  )

  if (!label) {
    return (
      <section
        data-slot="chat-sidebar-section"
        className={sectionClassName}
        {...props}
      >
        {children}
      </section>
    )
  }

  const section = (
    <section
      data-slot="chat-sidebar-section"
      className={sectionClassName}
      {...props}
    >
      <ChatSidebarSectionHeader
        label={label}
        action={action}
        collapsible={collapsible}
      />
      {collapsible ? (
        <CollapsibleContent
          keepMounted
          className="overflow-hidden transition-[height,opacity] duration-150 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        >
          {children}
        </CollapsibleContent>
      ) : (
        children
      )}
    </section>
  )

  return collapsible ? (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className="contents"
    >
      {section}
    </Collapsible>
  ) : (
    section
  )
}

export function ChatSidebarSectionHeader({
  label,
  action,
  collapsible = false,
  className,
}: {
  label: React.ReactNode
  action?: React.ReactNode
  collapsible?: boolean
  className?: string
}) {
  const triggerContent = (
    <>
      <span className="flex size-4 shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-150 group-data-[panel-open]/section-trigger:rotate-180",
            !collapsible && "opacity-0"
          )}
        >
          <path
            d="m5.5 7.8 4.5 4.4 4.5-4.4"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </>
  )

  const triggerClassName = cn(
    "flex min-w-0 flex-1 items-center gap-[2.25px] rounded-[9px] px-[18px] py-[6.75px] text-left text-[18px] leading-[27px] text-sidebar-muted-foreground outline-none transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-foreground",
    !collapsible && "cursor-default",
    className
  )

  const trigger = collapsible ? (
    <CollapsibleTrigger
      className={cn("group/section-trigger", triggerClassName)}
    >
      {triggerContent}
    </CollapsibleTrigger>
  ) : (
    <div className={triggerClassName}>{triggerContent}</div>
  )

  return (
    <div
      data-slot="chat-sidebar-section-header"
      className="group/section-header flex h-9 w-full items-center"
    >
      {trigger}
      {action ? (
        <span className="shrink-0 pr-[6.75px]">{action}</span>
      ) : null}
    </div>
  )
}

export function ChatSidebarSectionAction({
  tooltip,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
}) {
  const button = (
    <button
      type="button"
      data-slot="chat-sidebar-section-action"
      aria-label={props["aria-label"] ?? (typeof tooltip === "string" ? tooltip : undefined)}
      title={typeof tooltip === "string" ? tooltip : undefined}
      className={cn(
        "flex h-[40.5px] w-[38.25px] items-center justify-center rounded-[9px] text-sidebar-muted-foreground opacity-0 outline-none transition-[opacity,background-color,color] duration-150 group-hover/section-header:opacity-100 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:opacity-100 focus-visible:bg-sidebar-accent focus-visible:text-sidebar-foreground aria-expanded:opacity-100 [&>svg]:size-5 [&>svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )

  return tooltip ? (
    <ChatSidebarTooltip content={tooltip}>{button}</ChatSidebarTooltip>
  ) : (
    button
  )
}

export function ChatSidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="chat-sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

export function ChatSidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="chat-sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

export function ChatSidebarMenuButton({
  icon,
  trailing,
  isActive = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
    icon?: React.ReactNode
    /** Right-aligned slot: keyboard hint, external-link arrow, badge… */
    trailing?: React.ReactNode
    isActive?: boolean
  }) {
  return (
    <button
      type="button"
      data-slot="chat-sidebar-menu-button"
      data-active={isActive || undefined}
      className={cn(
        "relative mx-[6.75px] flex h-[40.5px] w-[calc(100%-13.5px)] cursor-pointer items-center gap-[6.75px] rounded-[10px] px-[11.25px] text-left text-[15.75px] leading-[22.5px] text-sidebar-foreground transition-colors duration-150 outline-none hover:bg-sidebar-accent focus-visible:bg-sidebar-accent [&>svg]:size-5 [&>svg]:shrink-0",
        isActive && "bg-sidebar-accent",
        className
      )}
      {...props}
    >
      {icon}
      <span className="truncate">{children}</span>
      {trailing ? (
        <span className="ml-auto flex shrink-0 items-center gap-1 text-sidebar-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </button>
  )
}

export function ChatSidebarMenuAction({
  tooltip,
  showOnHover = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
  /** Keep the action mounted so the title never shifts when actions appear. */
  showOnHover?: boolean
}) {
  const button = (
    <button
      type="button"
      data-slot="chat-sidebar-menu-action"
      aria-label={props["aria-label"] ?? (typeof tooltip === "string" ? tooltip : undefined)}
      title={typeof tooltip === "string" ? tooltip : undefined}
      className={cn(
        "absolute end-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-[9px] text-sidebar-muted-foreground outline-none transition-[opacity,background-color,color] duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-foreground aria-expanded:opacity-100 [&>svg]:size-5 [&>svg]:shrink-0",
        showOnHover &&
          "opacity-0 group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )

  return tooltip ? (
    <ChatSidebarTooltip content={tooltip}>{button}</ChatSidebarTooltip>
  ) : (
    button
  )
}

export function ChatSidebarMenuActions({
  open = false,
  className,
  children,
}: React.ComponentProps<"div"> & {
  /** Keep actions visible while one of their menus is open. */
  open?: boolean
}) {
  return (
    <div
      data-slot="chat-sidebar-menu-actions"
      className={cn(
        "absolute end-1 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded-[9px] bg-sidebar px-0.5 transition-opacity duration-150 group-hover/menu-item:pointer-events-auto group-focus-within/menu-item:pointer-events-auto group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ChatSidebarTooltip({
  content,
  side = "right",
  hidden = false,
  children,
}: {
  content?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  hidden?: boolean
  children: React.ReactElement
}) {
  if (!content) return children

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side} hidden={hidden}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

/* --------------------------------------------------------------------------
 * Icon buttons (header actions)
 * ------------------------------------------------------------------------ */

export function ChatSidebarIconButton({
  tooltip,
  muted = true,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
    tooltip?: React.ReactNode
    /** Muted renders in the tertiary text color, like ChatGPT's action icons. */
    muted?: boolean
  }) {
  const button = (
    <button
      type="button"
      data-slot="chat-sidebar-icon-button"
      title={typeof tooltip === "string" ? tooltip : undefined}
      className={cn(
        "flex size-[40.5px] cursor-pointer items-center justify-center rounded-[9px] transition-colors duration-150 outline-none hover:bg-sidebar-accent focus-visible:bg-sidebar-accent [&>svg]:size-5 [&>svg]:shrink-0",
        muted ? "text-sidebar-muted-foreground" : "text-sidebar-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )

  return tooltip ? (
    <ChatSidebarTooltip content={tooltip}>{button}</ChatSidebarTooltip>
  ) : (
    button
  )
}

/* --------------------------------------------------------------------------
 * Rail primitives (collapsed strip)
 * ------------------------------------------------------------------------ */

export function ChatSidebarRail({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="chat-sidebar-rail-content"
      aria-label="Sidebar"
      className={cn(
        "flex h-full w-(--chat-sidebar-rail-width) flex-col items-center pb-1.5",
        className
      )}
      {...props}
    />
  )
}

export function ChatSidebarRailHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-sidebar-rail-header"
      className={cn(
        "flex h-(--chat-sidebar-header-height) w-full items-center justify-center [&>svg]:size-6",
        className
      )}
      {...props}
    />
  )
}

export function ChatSidebarRailButton({
  icon,
  tooltip,
  isActive = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
    icon?: React.ReactNode
    tooltip?: React.ReactNode
    isActive?: boolean
  }) {
  const button = (
    <button
      type="button"
      data-slot="chat-sidebar-rail-button"
      title={typeof tooltip === "string" ? tooltip : undefined}
      data-active={isActive || undefined}
      className={cn(
        "mx-auto flex size-[40.5px] cursor-pointer items-center justify-center rounded-[10px] text-sidebar-foreground transition-colors duration-150 outline-none hover:bg-sidebar-accent focus-visible:bg-sidebar-accent [&>svg]:size-5 [&>svg]:shrink-0",
        isActive && "bg-sidebar-accent",
        className
      )}
      {...props}
      onClick={(event) => {
        // Rail buttons act without triggering the rail's expand-on-click.
        event.stopPropagation()
        onClick?.(event)
      }}
    >
      {icon ?? props.children}
    </button>
  )

  return tooltip ? (
    <ChatSidebarTooltip content={tooltip} side="right">
      {button}
    </ChatSidebarTooltip>
  ) : (
    button
  )
}

export function ChatSidebarRailSpacer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-sidebar-rail-spacer"
      className={cn("pointer-events-none flex-1", className)}
      {...props}
    />
  )
}

/* --------------------------------------------------------------------------
 * Trigger & inset
 * ------------------------------------------------------------------------ */

export function ChatSidebarTrigger({
  className,
  onClick,
  tooltip,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ChatSidebarIconButton>, "tooltip"> & {
  tooltip?: React.ReactNode
}) {
  const { isMobile, open, openMobile, toggleSidebar } = useChatSidebar()

  return (
    <ChatSidebarIconButton
      data-slot="chat-sidebar-trigger"
      tooltip={tooltip}
      className={className}
      aria-expanded={props["aria-expanded"] ?? (isMobile ? openMobile : open)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggleSidebar()
      }}
      {...props}
    >
      {children ?? (
        <>
          <PanelLeftIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </ChatSidebarIconButton>
  )
}

export function ChatSidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="chat-sidebar-inset"
      className={cn(
        "relative flex min-w-0 flex-1 flex-col bg-background",
        className
      )}
      {...props}
    />
  )
}

/* --------------------------------------------------------------------------
 * Tooltip provider wrapper — mount once around the provider output.
 * ------------------------------------------------------------------------ */

export function ChatSidebarRoot({
  children,
  ...props
}: React.ComponentProps<typeof ChatSidebarProvider>) {
  return (
    <ChatSidebarProvider {...props}>
      <TooltipProvider delay={400}>{children}</TooltipProvider>
    </ChatSidebarProvider>
  )
}
