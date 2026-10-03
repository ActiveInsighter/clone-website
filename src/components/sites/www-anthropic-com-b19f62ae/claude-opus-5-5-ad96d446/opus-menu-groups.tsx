"use client"

import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"

export interface OpusMenuGroup {
  label: string
  links: readonly { label: string; href: string }[]
}

export function OpusMenuGroups({ groups }: { groups: readonly OpusMenuGroup[] }) {
  return groups.map((group, index) => (
    <DropdownMenuGroup key={`${group.label}-${index}`}>
      {group.label && <DropdownMenuLabel className="opus-nav-dropdown-label">{group.label}</DropdownMenuLabel>}
      {group.links.map(link => (
        <DropdownMenuItem key={link.href} render={<a href={link.href} />} className="opus-nav-dropdown-link">
          {link.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  ))
}
