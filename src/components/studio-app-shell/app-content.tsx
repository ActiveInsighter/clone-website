import * as React from "react";

import { cn } from "@/lib/utils";

export function AppContent({ className, children, id = "main", tabIndex = -1, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      id={id}
      tabIndex={tabIndex}
      className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--studio-bg)] outline-none", className)}
      {...props}
    >
      {children}
    </main>
  );
}
