import * as React from "react";

import { cn } from "@/lib/utils";

export function AppContent({ className, children, ...props }: React.ComponentProps<"main">) {
  return (
    <main className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--studio-bg)]", className)} {...props}>
      {children}
    </main>
  );
}
