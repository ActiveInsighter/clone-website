"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarBehaviorProvider } from "@/hooks/use-sidebar-behavior";
import { cn } from "@/lib/utils";
import type { NavigationGroup } from "@/types/navigation";

import { AppContent } from "./app-content";
import { AppSidebar } from "./app-sidebar";

interface AppShellProps {
  navigation: NavigationGroup[];
  header?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
  basePath?: string;
  className?: string;
}

export function AppShell({
  navigation,
  header,
  sidebarFooter,
  children,
  basePath = "",
  className,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <SidebarBehaviorProvider>
      <div
        className={cn("studio-shell flex h-svh w-full flex-col overflow-hidden", className)}
        style={{
          ["--sidebar-width" as string]: "234px",
          ["--sidebar-width-collapsed" as string]: "54px",
          ["--header-height" as string]: "54px",
        } as React.CSSProperties}
      >
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-[var(--studio-panel)] px-3 py-2 text-sm text-[var(--studio-text)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-[var(--studio-ring)]"
        >
          Skip to content
        </a>

        <header className="flex h-[var(--header-height)] shrink-0 items-center border-b border-[var(--studio-border)] bg-[var(--studio-panel)] px-0">
          <button
            type="button"
            aria-label="Open navigation"
            className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--studio-muted)] transition-colors hover:bg-[var(--studio-hover)] md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-[18px]" />
          </button>
          <div className="min-w-0 flex-1">{header}</div>
        </header>

        <div className="flex min-h-0 flex-1 flex-row">
          <div className="hidden min-h-0 md:flex">
            <AppSidebar navigation={navigation} footer={sidebarFooter} basePath={basePath} />
          </div>
          <AppContent>{children}</AppContent>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" showCloseButton={false} className="w-[min(92vw,23rem)] gap-0 border-[var(--studio-border)] bg-[var(--studio-sidebar)] p-0 text-[var(--studio-text)]">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Primary and product navigation.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-[var(--studio-border)] px-3">
                <span className="text-sm font-medium text-[var(--studio-text)]">Navigation</span>
                <SheetClose
                  render={
                    <button
                      type="button"
                      aria-label="Close navigation"
                      className="flex size-8 items-center justify-center rounded-md text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)]"
                    />
                  }
                >
                  <X className="size-[18px]" />
                </SheetClose>
              </div>
              <AppSidebar
                navigation={navigation}
                footer={sidebarFooter}
                mobile
                forceExpanded
                basePath={basePath}
                className="min-h-0 flex-1"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarBehaviorProvider>
  );
}
