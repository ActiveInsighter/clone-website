export const studioPaths = [
  "/", "/dashboard", "/editor", "/sql", "/database", "/auth", "/storage",
  "/functions", "/realtime", "/advisors", "/observability", "/logs", "/integrations", "/settings",
  ...["schemas", "tables", "functions", "triggers", "types", "extensions", "indexes",
    "publications", "policies", "roles", "settings", "replication", "backups", "migrations"].map(path => `/database/${path}`),
] as const
