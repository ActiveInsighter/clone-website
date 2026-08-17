import Link from "next/link";

import {
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { resolveNavigationHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

interface AppSidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  basePath?: string;
}

export function AppSidebarItem({ item, isActive, basePath = "" }: AppSidebarItemProps) {
  const Icon = item.icon;
  const resolvedHref = resolveNavigationHref(item.href, basePath);

  const contents = (
    <>
      <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
        {Icon ? <Icon className="size-[17px]" strokeWidth={1.5} /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span className="min-w-0 max-w-[14rem] truncate whitespace-nowrap text-[14.625px] leading-[20.9px] transition-[max-width,opacity] duration-100 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
        {item.title}
      </span>
      {item.badge !== undefined ? (
        <span className="ml-auto shrink-0 rounded bg-[var(--studio-badge)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--studio-badge-text)] transition-opacity duration-100 group-data-[collapsible=icon]:opacity-0">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  const target = resolvedHref && !item.disabled ? (
    <Link href={resolvedHref} aria-current={isActive ? "page" : undefined}>
      {contents}
    </Link>
  ) : (
    <button type="button" disabled aria-current={isActive ? "page" : undefined}>
      {contents}
    </button>
  );

  return (
    <SidebarMenuButton
      render={target}
      isActive={isActive}
      disabled={item.disabled}
      tooltip={item.title}
      className={cn(
        "h-8 rounded-md px-1.5 py-2 text-[14.625px] leading-[20.9px] text-[var(--studio-muted)]",
        "hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--studio-ring)]",
        "data-active:!bg-[var(--studio-active)] data-active:!font-normal data-active:!text-[var(--studio-text)]",
        "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!",
        item.disabled && "opacity-45",
      )}
    />
  );
}
