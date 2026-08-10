"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { matchesNavigationItem } from "@/lib/navigation";
import type { NavigationGroup } from "@/types/navigation";

interface SecondarySidebarProps {
  title: string;
  description?: string;
  groups: NavigationGroup[];
  footer?: React.ReactNode;
  className?: string;
  width?: string;
}

export function SecondarySidebar({ title, description, groups, footer, className, width = "var(--secondary-sidebar-width)" }: SecondarySidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label={`${title} navigation`}
      className={cn("flex h-full min-h-0 shrink-0 flex-col bg-[var(--studio-sidebar)] text-[var(--studio-text)]", className)}
      style={{ width }}
    >
      <div className="flex h-[var(--header-height)] shrink-0 items-center border-b border-[var(--studio-border)] px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium">{title}</h2>
          {description ? <p className="mt-0.5 truncate text-xs text-[var(--studio-muted)]">{description}</p> : null}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {groups.map((group, groupIndex) => (
          <section key={group.id} className={cn(groupIndex > 0 && "mt-5 border-t border-[var(--studio-border)] pt-4")}>
            {group.title ? <h3 className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--studio-muted)]">{group.title}</h3> : null}
            <ul className="space-y-0">
              {group.items.map((item) => {
                const active = matchesNavigationItem(item, pathname);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href ?? "#"}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-[27px] items-center gap-2 rounded-md px-2 text-[14.625px] leading-[20.9px] transition-colors duration-150",
                        active
                          ? "bg-[var(--studio-active)] font-medium text-[var(--studio-text)]"
                          : "text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)]",
                        item.disabled && "pointer-events-none opacity-45",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      {item.badge ? <span className="rounded bg-[var(--studio-badge)] px-1 py-0.5 text-[10px] text-[var(--studio-badge-text)]">{item.badge}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      {footer ? <div className="shrink-0 border-t border-[var(--studio-border)] p-3">{footer}</div> : null}
    </aside>
  );
}
