"use client";

import * as React from "react";
import {
  Copy,
  Diamond,
  Download,
  HelpCircle,
  KeyRound,
  Moon,
  MoreVertical,
  Search,
  Sparkles,
  Sun,
  Table2,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { AppHeader, AppShell } from "@/components/app-shell";
import { primaryNavigation } from "@/config/navigation";

const pageTitles: Record<string, string> = {
  "/": "Project Overview",
  "/dashboard": "Project Overview",
  "/editor": "Table Editor",
  "/sql": "SQL Editor",
  "/storage": "Storage",
  "/settings": "Project Settings",
  "/auth": "Authentication",
  "/functions": "Edge Functions",
  "/realtime": "Realtime",
};

type TableField = {
  name: string;
  type: string;
  marker?: "primary" | "unique" | "nullable";
};

const tableFields: TableField[] = [
  { name: "id", type: "uuid", marker: "primary" },
  { name: "user_id", type: "uuid" },
  { name: "status", type: "text" },
  { name: "input_path", type: "text" },
  { name: "assets_path", type: "text" },
  { name: "output_path", type: "text" },
  { name: "has_assets", type: "bool" },
  { name: "theme", type: "text" },
  { name: "options", type: "jsonb" },
  { name: "github_run_id", type: "int8" },
  { name: "github_run_url", type: "text" },
  { name: "github_commit", type: "text" },
  { name: "error_message", type: "text" },
  { name: "attempt_count", type: "int2" },
  { name: "created_at", type: "timestamptz" },
  { name: "updated_at", type: "timestamptz" },
  { name: "started_at", type: "timestamptz" },
  { name: "completed_at", type: "timestamptz" },
  { name: "expires_at", type: "timestamptz" },
  { name: "progress_percent", type: "int2" },
  { name: "progress_stage", type: "text" },
  { name: "uploaded_at", type: "timestamptz" },
  { name: "queued_at", type: "timestamptz" },
  { name: "rendering_at", type: "timestamptz" },
  { name: "uploading_at", type: "timestamptz" },
  { name: "source_filename", type: "text" },
  { name: "document_name", type: "text" },
  { name: "source_name", type: "text" },
  { name: "output_filename", type: "text" },
  { name: "is_favorite", type: "bool" },
  { name: "source_job_id", type: "uuid" },
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/database")) return "Database";
  return pageTitles[pathname] ?? "Workspace";
}

function ColumnMarker({ marker }: { marker?: TableField["marker"] }) {
  if (marker === "primary") return <KeyRound className="size-[9px] shrink-0 text-[var(--studio-muted)]" />;
  if (marker === "unique") return <Diamond className="size-[9px] shrink-0 text-[var(--studio-muted)]" />;
  if (marker === "nullable") return <span className="size-[7px] shrink-0 rounded-full border border-[var(--studio-muted)]" />;
  return <span className="size-[5px] shrink-0 rounded-full bg-[var(--studio-muted)]/60" />;
}

function FlowTableNode({ title, fields }: { title: string; fields: TableField[] }) {
  return (
    <article className="studio-flow-table studio-flow-table-primary">
      <header className="flex h-[19px] items-center justify-between bg-[var(--studio-canvas)] px-[9px] text-[9.9px] leading-[14.85px]">
        <div className="flex min-w-0 items-center gap-1.5">
          <Table2 className="size-[10px] text-[var(--studio-muted)]" />
          <span className="truncate">{title}</span>
        </div>
        <button type="button" aria-label={`${title} actions`} className="flex size-[14px] items-center justify-center rounded text-[var(--studio-muted)] hover:bg-[var(--studio-hover)]">
          <MoreVertical className="size-[9px]" />
        </button>
      </header>
      <div>
        {fields.map((field) => (
          <div key={field.name} className="studio-flow-table-row group flex h-[19px] items-center pr-[4px] text-[8px] leading-[18px]">
            <span className="mx-2 flex w-[19px] shrink-0 items-center gap-1">
              <ColumnMarker marker={field.marker} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[var(--studio-text)]">{field.name}</span>
            <span className="shrink-0 pl-2 pr-1 font-mono text-[7.2px] text-[var(--studio-muted)]">{field.type}</span>
            <button type="button" aria-label={`${title} ${field.name} actions`} className="absolute right-1 hidden size-[14px] items-center justify-center rounded text-[var(--studio-muted)] group-hover:flex">
              <MoreVertical className="size-[9px]" />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

function DatabaseSurface() {
  return (
    <div className="flex h-full min-h-full flex-col">
      <div className="flex h-[54px] shrink-0 items-center gap-2 border-b border-[var(--studio-border)] bg-[var(--studio-panel)] px-4">
        <button type="button" aria-label="schema public" className="flex h-8 items-center gap-2 rounded-md border border-[var(--studio-border)] px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)]">
          <span className="text-[10px] uppercase tracking-wide">schema</span>
          <span className="font-medium text-[var(--studio-text)]">public</span>
        </button>
        <button type="button" className="flex h-8 items-center gap-2 rounded-md px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)]">
          <Search className="size-3.5" />
          Find table…
        </button>
        <div className="min-w-0 flex-1" />
        <button type="button" className="hidden h-8 items-center gap-2 rounded-md px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] sm:flex">
          <Copy className="size-3.5" />
          Copy as SQL
        </button>
        <button type="button" className="hidden h-8 items-center gap-2 rounded-md px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] sm:flex">
          <Download className="size-3.5" />
          Export options
        </button>
        <button type="button" className="hidden h-8 items-center gap-2 rounded-md px-2 text-xs text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] lg:flex">
          Auto layout
        </button>
      </div>
      <div className="studio-flow-canvas relative min-h-0 flex-1 overflow-hidden">
        <div className="studio-flow-grid absolute inset-0" />
        <svg className="studio-flow-edges pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 662" preserveAspectRatio="none" aria-hidden="true">
          <path d="M528 58 C548 58 538 295 550 295" />
          <path d="M528 105 C548 105 548 295 550 295" />
        </svg>
        <FlowTableNode title="pdf_jobs" fields={tableFields} />
        <div className="studio-flow-reference">auth.users.id</div>
        <div className="studio-flow-minimap" aria-hidden="true">
          <div className="studio-flow-minimap-viewport" />
          <div className="studio-flow-minimap-node studio-flow-minimap-node-primary" />
          <div className="studio-flow-minimap-node studio-flow-minimap-node-reference" />
        </div>
        <div className="studio-flow-legend pointer-events-none absolute bottom-0 left-1/2 flex h-9 -translate-x-1/2 items-center gap-4 whitespace-nowrap text-[12px] text-[var(--studio-text)]">
          <span className="inline-flex items-center gap-1.5"><KeyRound className="size-3.5 text-[var(--studio-muted)]" /> Primary key</span>
          <span className="inline-flex items-center gap-1.5"><span className="text-sm text-[var(--studio-muted)]">#</span> Identity</span>
          <span className="inline-flex items-center gap-1.5"><Diamond className="size-3.5 text-[var(--studio-muted)]" /> Unique</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full border border-[var(--studio-muted)]" /> Nullable</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[var(--studio-muted)]" /> Non-nullable</span>
        </div>
      </div>
    </div>
  );
}

function GenericSurface({ title }: { title: string }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-6 px-5 py-8 lg:px-8">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--studio-muted)]">Workspace</p>
        <h1 className="text-2xl font-medium tracking-tight text-[var(--studio-text)]">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--studio-muted)]">A reusable App Shell demo surface with the same compact information density as a developer tool.</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-[var(--studio-border)] bg-[var(--studio-panel)]">
        {[
          ["Request volume", "24,892", "+12.8%"],
          ["Active resources", "1,284", "+4.2%"],
          ["Latest deployment", "7 minutes ago", "Healthy"],
        ].map(([label, value, change]) => (
          <div key={label} className="flex items-center justify-between border-b border-[var(--studio-border)] px-4 py-4 last:border-0">
            <div><p className="text-sm text-[var(--studio-muted)]">{label}</p><p className="mt-1 text-lg font-medium text-[var(--studio-text)]">{value}</p></div>
            <span className="rounded bg-[var(--studio-active)] px-2 py-1 text-xs text-[var(--studio-text)]">{change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudioDemo() {
  const pathname = usePathname();
  const [dark, setDark] = React.useState(true);
  const isDatabase = pathname === "/database" || pathname.startsWith("/database/");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  const actions = (
    <>
      <button type="button" aria-label="Search" className="flex size-8 items-center justify-center rounded-md text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)]"><Search className="size-4" /></button>
      <button type="button" aria-label="Help" className="hidden size-8 items-center justify-center rounded-md text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)] sm:flex"><HelpCircle className="size-4" /></button>
      <button type="button" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="flex size-8 items-center justify-center rounded-md text-[var(--studio-muted)] hover:bg-[var(--studio-hover)] hover:text-[var(--studio-text)]" onClick={() => setDark((value) => !value)}>{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
      <button type="button" className="ml-1 flex size-8 items-center justify-center rounded-md bg-[var(--studio-accent)] text-[var(--studio-accent-foreground)]"><Sparkles className="size-4" /></button>
    </>
  );

  return (
    <AppShell
      navigation={primaryNavigation}
      header={<AppHeader project="md-to-pdf" breadcrumbs={[]} actions={actions} />}
    >
      {isDatabase ? <DatabaseSurface /> : <GenericSurface title={getPageTitle(pathname)} />}
    </AppShell>
  );
}
