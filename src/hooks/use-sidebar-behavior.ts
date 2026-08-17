"use client";

import * as React from "react";

export type SidebarBehavior = "expanded" | "collapsed" | "expand-on-hover";

export const SIDEBAR_BEHAVIOR_STORAGE_KEY = "app-shell-sidebar-behavior";

interface SidebarBehaviorContextValue {
  behavior: SidebarBehavior;
  setBehavior: (behavior: SidebarBehavior) => void;
}

interface SidebarBehaviorProviderProps {
  children: React.ReactNode;
  defaultBehavior?: SidebarBehavior;
  behavior?: SidebarBehavior;
  onBehaviorChange?: (behavior: SidebarBehavior) => void;
  storageKey?: string;
}

const SidebarBehaviorContext = React.createContext<SidebarBehaviorContextValue | null>(null);

function isSidebarBehavior(value: string | null): value is SidebarBehavior {
  return value === "expanded" || value === "collapsed" || value === "expand-on-hover";
}

export function SidebarBehaviorProvider({
  children,
  defaultBehavior = "expand-on-hover",
  behavior: controlledBehavior,
  onBehaviorChange,
  storageKey = SIDEBAR_BEHAVIOR_STORAGE_KEY,
}: SidebarBehaviorProviderProps) {
  const [uncontrolledBehavior, setUncontrolledBehavior] = React.useState<SidebarBehavior>(defaultBehavior);
  const behavior = controlledBehavior ?? uncontrolledBehavior;

  React.useEffect(() => {
    if (controlledBehavior !== undefined) return;

    const savedBehavior = window.localStorage.getItem(storageKey);
    if (isSidebarBehavior(savedBehavior)) setUncontrolledBehavior(savedBehavior);
  }, [controlledBehavior, storageKey]);

  const setBehavior = React.useCallback(
    (nextBehavior: SidebarBehavior) => {
      if (controlledBehavior === undefined) setUncontrolledBehavior(nextBehavior);
      onBehaviorChange?.(nextBehavior);
      window.localStorage.setItem(storageKey, nextBehavior);
    },
    [controlledBehavior, onBehaviorChange, storageKey],
  );

  const value = React.useMemo(
    () => ({ behavior, setBehavior }),
    [behavior, setBehavior],
  );

  return React.createElement(SidebarBehaviorContext.Provider, { value }, children);
}

export function useSidebarBehavior(): SidebarBehaviorContextValue {
  const context = React.useContext(SidebarBehaviorContext);
  if (!context) throw new Error("useSidebarBehavior must be used within a SidebarBehaviorProvider.");
  return context;
}
