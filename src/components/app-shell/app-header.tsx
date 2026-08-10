import * as React from "react";
import { ChevronDown, GitBranch, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface AppHeaderProps {
  organization?: string;
  project?: string;
  environment?: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
  className?: string;
}

export function AppHeader({ organization = "Workspace", project = "Project", environment = "Production", breadcrumbs = [], actions, className }: AppHeaderProps) {
  return (
    <div className={cn("flex h-full min-w-0 items-center justify-between gap-3 px-3", className)}>
      <div className="flex min-w-0 items-center gap-1">
        <button type="button" aria-label="Back to organization home" className="flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--studio-accent)] hover:bg-[var(--studio-hover)]">
          <Sparkles className="size-[18px]" strokeWidth={2.3} />
        </button>
        <button type="button" className="hidden h-8 min-w-0 items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-[var(--studio-hover)] md:flex">
          <span className="truncate text-[var(--studio-muted)]">{organization}</span>
          <ChevronDown className="size-3.5 shrink-0 text-[var(--studio-muted)]" />
        </button>
        <span className="px-1 text-[var(--studio-muted)]">/</span>
        <button type="button" className="flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-[var(--studio-hover)]">
          <span className="truncate font-medium text-[var(--studio-text)]">{project}</span>
          <ChevronDown className="size-3.5 shrink-0 text-[var(--studio-muted)]" />
        </button>
        <button type="button" className="hidden h-8 items-center gap-2 rounded-md border border-[var(--studio-border)] px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] sm:flex">
          <GitBranch className="size-3.5" />
          <span className="text-[var(--studio-text)]">main</span>
          <span className="rounded bg-[var(--studio-active)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--studio-muted)]">{environment}</span>
        </button>
        {breadcrumbs.length > 0 ? (
          <div className="hidden min-w-0 items-center gap-1 text-sm text-[var(--studio-muted)] lg:flex">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={`${breadcrumb}-${index}`}>
                <span className="text-[var(--studio-border-strong)]">/</span>
                <span className={cn("truncate", index === breadcrumbs.length - 1 && "font-medium text-[var(--studio-text)]")}>{breadcrumb}</span>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">{actions}</div>
    </div>
  );
}
