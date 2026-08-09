/**
 * Product-neutral compound sidebar primitives.
 *
 * The implementation lives in the original compound component module so
 * existing imports remain stable. Consumers should use this generic entry
 * point when composing a new product shell.
 */
export {
  ChatSidebarRoot as SidebarRoot,
  ChatSidebarProvider as SidebarProvider,
  ChatSidebar as Sidebar,
  ChatSidebarHeader as SidebarHeader,
  ChatSidebarContent as SidebarContent,
  ChatSidebarFooter as SidebarFooter,
  ChatSidebarSection as SidebarSection,
  ChatSidebarSectionHeader as SidebarSectionHeader,
  ChatSidebarSectionAction as SidebarSectionAction,
  ChatSidebarMenu as SidebarMenu,
  ChatSidebarMenuItem as SidebarMenuItem,
  ChatSidebarMenuButton as SidebarMenuButton,
  ChatSidebarMenuAction as SidebarMenuAction,
  ChatSidebarMenuActions as SidebarMenuActions,
  ChatSidebarTooltip as SidebarTooltip,
  ChatSidebarIconButton as SidebarIconButton,
  ChatSidebarRail as SidebarRail,
  ChatSidebarRailHeader as SidebarRailHeader,
  ChatSidebarRailButton as SidebarRailButton,
  ChatSidebarRailSpacer as SidebarRailSpacer,
  ChatSidebarTrigger as SidebarTrigger,
  ChatSidebarInset as SidebarInset,
  useChatSidebar as useSidebar,
} from "@/components/chat-sidebar"
