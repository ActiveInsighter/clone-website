"use client"

import * as React from "react"
import Link from "next/link"

import {
  SidebarFooter,
  SidebarHeader,
  SidebarIconAnchor,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarPanel,
  SidebarRail,
  SidebarRailButton,
  SidebarRailFooter,
  SidebarRailHeader,
  SidebarRailMenu,
  SidebarScrollArea,
  SidebarSection,
  SidebarSectionContent,
  SidebarSectionHeader,
  SidebarSectionTrigger,
  SidebarShell,
  SidebarTrigger,
  useSidebar,
} from "@/components/sidebar"
import {
  ChatHistoryIcon,
  ChevronDownIcon,
  ComposeIcon,
  FolderIcon,
  LibraryIcon,
  SearchChatsIcon,
  SettingsCogIcon,
  SidebarToggleIcon,
} from "@/components/icons"

import type {
  ConfiguredSidebarConfig,
  ConfiguredSidebarItem,
  ConfiguredSidebarSection,
} from "./configured-sidebar-types"

export type { ConfiguredSidebarConfig, ConfiguredSidebarItem, ConfiguredSidebarSection }

const iconMap = {
  compose: ComposeIcon,
  search: SearchChatsIcon,
  library: LibraryIcon,
  folder: FolderIcon,
  history: ChatHistoryIcon,
} as const

function ConfiguredSidebarIcon({ name }: { name?: ConfiguredSidebarItem["icon"] }) {
  if (!name) return null
  const Icon = iconMap[name]
  return <Icon />
}

function NavItem({
  item,
  active,
  onSelect,
}: {
  item: ConfiguredSidebarItem
  active: boolean
  onSelect?: (item: ConfiguredSidebarItem) => void
}) {
  const content = (
    <SidebarMenuButton
      icon={<ConfiguredSidebarIcon name={item.icon} />}
      nativeButton={false}
      render={<Link href={item.href ?? "#"} onClick={() => onSelect?.(item)} />}
      title={item.label}
    >
      {item.label}
    </SidebarMenuButton>
  )

  return <SidebarMenuItem active={active}>{content}</SidebarMenuItem>
}

function SectionItems({
  items,
  activeItemId,
  onSelect,
}: {
  items: readonly ConfiguredSidebarItem[]
  activeItemId?: string
  onSelect?: (item: ConfiguredSidebarItem) => void
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <NavItem
          active={item.id === activeItemId}
          item={item}
          key={item.id}
          onSelect={onSelect}
        />
      ))}
    </SidebarMenu>
  )
}

function SidebarSections({
  sections,
  activeItemId,
  onSelect,
}: {
  sections: readonly ConfiguredSidebarSection[]
  activeItemId?: string
  onSelect?: (item: ConfiguredSidebarItem) => void
}) {
  return (
    <div className="configured-sidebar-sections">
      {sections.map((section) => (
        <SidebarSection defaultOpen={section.defaultOpen} key={section.id}>
          <SidebarSectionHeader>
            <SidebarSectionTrigger>{section.label}</SidebarSectionTrigger>
          </SidebarSectionHeader>
          <SidebarSectionContent>
            <SectionItems
              activeItemId={activeItemId}
              items={section.items}
              onSelect={onSelect}
            />
          </SidebarSectionContent>
        </SidebarSection>
      ))}
    </div>
  )
}

export type ConfiguredSidebarProps = {
  config: ConfiguredSidebarConfig
  activeItemId?: string
  onSelect?: (item: ConfiguredSidebarItem) => void
  className?: string
}

export function ConfiguredSidebar({
  config,
  activeItemId,
  onSelect,
  className,
}: ConfiguredSidebarProps) {
  return (
    <SidebarShell
      className={className}
      label={config.label}
      rail={
        <SidebarRail className="configured-sidebar-rail">
          <SidebarRailHeader>
            <SidebarTrigger surface="rail" tooltip={config.openLabel}>
              <SidebarToggleIcon />
            </SidebarTrigger>
          </SidebarRailHeader>
          <SidebarRailMenu>
            {config.primaryItems.map((item) => (
              <SidebarRailButton
                active={item.id === activeItemId}
                aria-label={item.label}
                icon={<ConfiguredSidebarIcon name={item.icon} />}
                key={item.id}
                onClick={() => onSelect?.(item)}
                tooltip={item.label}
              />
            ))}
            {config.secondaryItems.map((item) => (
              <SidebarRailButton
                active={item.id === activeItemId}
                aria-label={item.label}
                icon={<ConfiguredSidebarIcon name={item.icon} />}
                key={item.id}
                onClick={() => onSelect?.(item)}
                tooltip={item.label}
              />
            ))}
          </SidebarRailMenu>
          <SidebarRailFooter>
            <SidebarRailButton
              aria-label={config.settingsLabel}
              icon={<SettingsCogIcon />}
              onClick={() => onSelect?.({ id: "settings", label: config.settingsLabel })}
              tooltip={config.settingsLabel}
            />
          </SidebarRailFooter>
        </SidebarRail>
      }
    >
      <SidebarPanel className="configured-sidebar-panel">
        <SidebarHeader className="configured-sidebar-header">
          <div className="configured-sidebar-brand" aria-label={config.brandLabel}>
            <span className="configured-sidebar-brand-mark" aria-hidden="true">✦</span>
            <span>{config.brandLabel}</span>
          </div>
          <SidebarIconAnchor>
            <SidebarTrigger surface="panel" tooltip={config.closeLabel}>
              <SidebarToggleIcon />
            </SidebarTrigger>
          </SidebarIconAnchor>
        </SidebarHeader>

        <SidebarScrollArea className="configured-sidebar-scroll">
          <SidebarMenu>
            {config.primaryItems.map((item) => (
              <NavItem
                active={item.id === activeItemId}
                item={item}
                key={item.id}
                onSelect={onSelect}
              />
            ))}
          </SidebarMenu>
          <SidebarMenu className="configured-sidebar-secondary">
            {config.secondaryItems.map((item) => (
              <NavItem
                active={item.id === activeItemId}
                item={item}
                key={item.id}
                onSelect={onSelect}
              />
            ))}
          </SidebarMenu>
          <SidebarSections
            activeItemId={activeItemId}
            onSelect={onSelect}
            sections={config.sections}
          />
        </SidebarScrollArea>

        <SidebarFooter className="configured-sidebar-footer">
          <div className="configured-sidebar-account">
            <span className="configured-sidebar-avatar" aria-hidden="true">T</span>
            <span className="configured-sidebar-account-name">{config.accountLabel}</span>
          </div>
          <button
            aria-label={config.settingsLabel}
            className="configured-sidebar-settings"
            onClick={() => onSelect?.({ id: "settings", label: config.settingsLabel })}
            type="button"
          >
            <SettingsCogIcon />
          </button>
        </SidebarFooter>
      </SidebarPanel>
    </SidebarShell>
  )
}

export function ConfiguredSidebarMobileTrigger({ label }: { label: string }) {
  return (
    <SidebarTrigger className="configured-sidebar-mobile-trigger" surface="external" tooltip={label}>
      <SidebarToggleIcon />
    </SidebarTrigger>
  )
}

export function ConfiguredSidebarStatus({ label }: { label: string }) {
  const { open } = useSidebar()
  return <span className="sr-only">{open ? `${label} 已展开` : `${label} 已收起`}</span>
}

export { ChevronDownIcon }
