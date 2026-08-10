"use client";

import * as React from "react";
import { PanelLeftDashed } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarBehavior } from "@/hooks/use-sidebar-behavior";

interface AppSidebarFooterProps {
  behavior: SidebarBehavior;
  isExpanded: boolean;
  setBehavior: (behavior: SidebarBehavior) => void;
  children?: React.ReactNode;
}

export function AppSidebarFooter({ behavior, isExpanded, setBehavior, children }: AppSidebarFooterProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const options: Array<{ value: SidebarBehavior; label: string }> = [
    { value: "expanded", label: "Expanded" },
    { value: "collapsed", label: "Collapsed" },
    { value: "expand-on-hover", label: "Expand on hover" },
  ];

  return (
    <div className="relative flex min-w-0 flex-col">
      {children ? <div className="mb-2 min-w-0 overflow-hidden">{children}</div> : null}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          type="button"
          aria-label="Sidebar control"
          title={!isExpanded ? "Sidebar control" : undefined}
          className="mx-0.5 flex h-[26px] w-[29px] shrink-0 items-center justify-center rounded-md p-0 text-[var(--studio-muted)] transition-colors duration-100 hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)] data-popup-open:bg-[var(--studio-hover)] data-popup-open:text-[var(--studio-text)]"
        >
          <PanelLeftDashed className="size-[18px]" strokeWidth={1.5} />
          <span className="sr-only">Sidebar control</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={4}
          className="w-[180px] rounded-md border-[var(--studio-border-strong)] bg-[var(--studio-panel)] p-1 text-[var(--studio-text)] shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1 text-xs font-medium text-[var(--studio-muted)]">Sidebar control</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1 bg-[var(--studio-border)]" />
          <DropdownMenuRadioGroup
            value={behavior}
            onValueChange={(value) => {
              if (value === "expanded" || value === "collapsed" || value === "expand-on-hover") {
                setBehavior(value);
                setIsMenuOpen(false);
              }
            }}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="relative h-8 rounded-md py-1 pl-7 pr-2 text-sm text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)] focus:bg-[var(--studio-hover)] focus:text-[var(--studio-text)] data-[checked]:before:absolute data-[checked]:before:left-2 data-[checked]:before:top-1/2 data-[checked]:before:size-2 data-[checked]:before:-translate-y-1/2 data-[checked]:before:rounded-full data-[checked]:before:bg-[var(--studio-text)] [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
