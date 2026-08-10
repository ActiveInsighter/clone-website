import {
  Activity,
  Blocks,
  Boxes,
  Database,
  FileCode2,
  Gauge,
  LayoutDashboard,
  Logs,
  Settings,
  ShieldCheck,
  Table2,
  TerminalSquare,
  Users,
} from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const primaryNavigation: NavigationGroup[] = [
  {
    id: "overview",
    items: [
      { id: "dashboard", title: "Project Overview", href: "/dashboard", icon: LayoutDashboard, activePatterns: ["/", "/dashboard"] },
      { id: "editor", title: "Table Editor", href: "/editor", icon: Table2 },
      { id: "sql", title: "SQL Editor", href: "/sql", icon: TerminalSquare },
    ],
  },
  {
    id: "products",
    items: [
      {
        id: "database",
        title: "Database",
        href: "/database",
        icon: Database,
      },
      { id: "authentication", title: "Authentication", href: "/auth", icon: Users },
      { id: "storage", title: "Storage", href: "/storage", icon: Boxes },
      { id: "functions", title: "Edge Functions", href: "/functions", icon: FileCode2 },
      { id: "realtime", title: "Realtime", href: "/realtime", icon: Activity },
    ],
  },
  {
    id: "observability",
    items: [
      { id: "advisors", title: "Advisors", href: "/advisors", icon: ShieldCheck },
      { id: "observability", title: "Observability", href: "/observability", icon: Gauge },
      { id: "logs", title: "Logs", href: "/logs", icon: Logs },
      { id: "integrations", title: "Integrations", href: "/integrations", icon: Blocks },
    ],
  },
  {
    id: "settings",
    items: [{ id: "settings", title: "Project Settings", href: "/settings", icon: Settings }],
  },
];

export const databaseNavigation: NavigationGroup[] = [
  {
    id: "database-management",
    title: "Database Management",
    items: [
      {
        id: "schema-visualizer",
        title: "Schema Visualizer",
        href: "/database/schemas",
        match: (pathname) => pathname === "/database" || pathname === "/database/schemas" || pathname.startsWith("/database/schemas/"),
      },
      { id: "tables", title: "Tables", href: "/database/tables" },
      { id: "functions", title: "Functions", href: "/database/functions" },
      { id: "triggers", title: "Triggers", href: "/database/triggers" },
      { id: "types", title: "Enumerated Types", href: "/database/types" },
      { id: "extensions", title: "Extensions", href: "/database/extensions" },
      { id: "indexes", title: "Indexes", href: "/database/indexes" },
      { id: "publications", title: "Publications", href: "/database/publications" },
    ],
  },
  {
    id: "access-control",
    title: "Access Control",
    items: [
      { id: "policies", title: "Policies", href: "/database/policies" },
      { id: "roles", title: "Roles", href: "/database/roles" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    items: [{ id: "database-settings", title: "Settings", href: "/database/settings" }],
  },
  {
    id: "platform",
    title: "Platform",
    items: [
      { id: "replication", title: "Replication", href: "/database/replication", badge: "New" },
      { id: "backups", title: "Backups", href: "/database/backups" },
      { id: "migrations", title: "Migrations", href: "/database/migrations" },
    ],
  },
];
