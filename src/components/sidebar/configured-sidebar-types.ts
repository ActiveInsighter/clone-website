export type ConfiguredSidebarIconName =
  | "compose"
  | "search"
  | "library"
  | "folder"
  | "history"

export type ConfiguredSidebarItem = {
  id: string
  label: string
  href?: string
  icon?: ConfiguredSidebarIconName
}

export type ConfiguredSidebarSection = {
  id: string
  label: string
  defaultOpen?: boolean
  items: readonly ConfiguredSidebarItem[]
}

export type ConfiguredSidebarConfig = {
  label: string
  brandLabel: string
  openLabel: string
  closeLabel: string
  settingsLabel: string
  accountLabel: string
  primaryItems: readonly ConfiguredSidebarItem[]
  secondaryItems: readonly ConfiguredSidebarItem[]
  sections: readonly ConfiguredSidebarSection[]
}
