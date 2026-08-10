"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSidebarBehavior } from "@/hooks/use-sidebar-behavior";
import { cn } from "@/lib/utils";
import type { NavigationGroup } from "@/types/navigation";

import { AppSidebarFooter } from "./app-sidebar-footer";
import { AppSidebarGroup } from "./app-sidebar-group";

interface AppSidebarProps {
  navigation: NavigationGroup[];
  footer?: React.ReactNode;
  mobile?: boolean;
  forceExpanded?: boolean;
  className?: string;
}

export function AppSidebar({ navigation, footer, mobile = false, forceExpanded = false, className }: AppSidebarProps) {
  const pathname = usePathname();
  const { behavior, setBehavior, setHovering, isExpanded } = useSidebarBehavior();
  const expanded = forceExpanded || isExpanded;
  const reservedWidth = mobile
    ? "100%"
    : behavior === "expand-on-hover"
      ? "var(--sidebar-width-collapsed)"
      : expanded
        ? "var(--sidebar-width)"
        : "var(--sidebar-width-collapsed)";

  return (
    <TooltipProvider delay={expanded ? 700 : 0}>
      <div
        className={cn("relative h-full shrink-0", mobile && "w-full", !mobile && "z-30", className)}
        style={{ width: reservedWidth }}
        onMouseEnter={() => !mobile && setHovering(true)}
        onPointerEnter={() => !mobile && setHovering(true)}
      >
        <SidebarProvider
          open={expanded}
          onOpenChange={() => undefined}
          className="h-full min-h-0 w-full"
          style={{
            "--sidebar-width": "234px",
            "--sidebar-width-icon": "54px",
            height: "100%",
            minHeight: 0,
          } as React.CSSProperties}
        >
          <aside
            aria-label="Primary navigation"
            data-state={expanded ? "expanded" : "collapsed"}
            data-collapsible={expanded ? undefined : "icon"}
            data-variant="sidebar"
            data-side="left"
            className={cn(
              "group relative flex h-full flex-col overflow-visible border-r border-[var(--studio-border)] bg-[var(--studio-sidebar)] text-[var(--studio-text)] transition-[width,box-shadow] duration-100 ease-linear",
              mobile ? "w-full" : "absolute inset-y-0 left-0",
              !mobile && expanded && behavior === "expand-on-hover" && "shadow-[8px_0_24px_rgba(0,0,0,0.12)]",
            )}
            style={{ width: mobile ? "100%" : expanded ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" }}
            onMouseEnter={() => !mobile && setHovering(true)}
            onMouseLeave={() => !mobile && setHovering(false)}
            onPointerEnter={() => !mobile && setHovering(true)}
            onPointerLeave={() => !mobile && setHovering(false)}
          >
            <SidebarContent className="gap-0 overflow-y-auto overflow-x-hidden py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navigation.map((group, index) => (
                <React.Fragment key={group.id}>
                  {index > 0 ? <div className="h-px w-full shrink-0 bg-[var(--studio-border)]" aria-hidden="true" /> : null}
                  <AppSidebarGroup group={group} pathname={pathname} />
                </React.Fragment>
              ))}
            </SidebarContent>

            <SidebarFooter className="shrink-0 gap-0 p-2">
              <AppSidebarFooter behavior={behavior} isExpanded={expanded} setBehavior={setBehavior}>
                {footer}
              </AppSidebarFooter>
            </SidebarFooter>
          </aside>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
