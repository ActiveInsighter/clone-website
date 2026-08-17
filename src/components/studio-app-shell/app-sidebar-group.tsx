import { cn } from "@/lib/utils";
import { matchesNavigationItem } from "@/lib/navigation";
import type { NavigationGroup } from "@/types/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { AppSidebarItem } from "./app-sidebar-item";

interface AppSidebarGroupProps {
  group: NavigationGroup;
  pathname: string;
}

export function AppSidebarGroup({ group, pathname }: AppSidebarGroupProps) {
  return (
    <SidebarGroup className={cn("gap-0.5 px-2 py-[9px]", group.title && "py-2")}>
      {group.title ? (
        <SidebarGroupLabel className="mb-0 truncate px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--studio-muted)]">
          {group.title}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {group.items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <AppSidebarItem item={item} isActive={matchesNavigationItem(item, pathname)} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
