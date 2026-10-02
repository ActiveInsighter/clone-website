"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Menu } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OpusWordmark, OpusMonogram } from "./opus-wordmark"
import type { OpusSectionLink } from "./opus-hero"
import { opusNavigationGroups } from "./opus-navigation-data"

const navigation = [
  { label: "Research", href: "https://www.anthropic.com/research", submenu: true },
  { label: "Policy", href: "https://www.anthropic.com/policy" },
  { label: "Commitments", href: "https://www.anthropic.com/commitments", submenu: true },
  { label: "Learn", href: "https://www.anthropic.com/learn", submenu: true },
  { label: "News", href: "https://www.anthropic.com/news" },
] as const

export function OpusHeader() {
  const [hidden, setHidden] = useState(false)
  const [paper, setPaper] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const y = window.scrollY
      const difference = y - scrollRef.current
      const heroEnd = document.querySelector(".opus-hero")?.getBoundingClientRect().bottom ?? 0
      setPaper(heroEnd < 68)
      if (Math.abs(difference) > 6) {
        setHidden(y > 80 && difference > 0)
        scrollRef.current = y
      }
      if (y < 80) setHidden(false)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="opus-header" data-hidden={hidden && !menuOpen && !dropdownOpen} data-tone={paper ? "paper" : "hero"}>
      <a className="opus-skip-link" href="#main-content">Skip to main content</a>
      <a className="opus-skip-link" href="#footer">Skip to footer</a>
      <div className="opus-header-inner">
        <a href="https://www.anthropic.com/" aria-label="Anthropic home" className="opus-logo">
          <OpusWordmark className="opus-wordmark" /><OpusMonogram className="opus-monogram" />
        </a>
        <nav className="opus-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const groups = item.label in opusNavigationGroups ? opusNavigationGroups[item.label as keyof typeof opusNavigationGroups] : undefined
            return groups ? <DropdownMenu key={item.label} open={dropdownOpen === item.label} onOpenChange={(open) => setDropdownOpen(open ? item.label : null)}>
              <DropdownMenuTrigger className="opus-nav-trigger">{item.label}<ChevronDown size={12} aria-hidden="true" /></DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={18} className="opus-nav-dropdown">
                {groups.map((group, index) => <DropdownMenuGroup key={index}>
                  {group.label && <DropdownMenuLabel className="opus-nav-dropdown-label">{group.label}</DropdownMenuLabel>}
                  {group.links.map(link => <DropdownMenuItem key={link.href} render={<a href={link.href} />} className="opus-nav-dropdown-link">{link.label}</DropdownMenuItem>)}
                </DropdownMenuGroup>)}
              </DropdownMenuContent>
            </DropdownMenu> : <a key={item.label} href={item.href}>{item.label}</a>
          })}
        </nav>
        <a className="opus-claude-cta" href="https://claude.ai/"><span>Try Claude</span><ChevronDown size={12} aria-hidden="true" /></a>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="opus-mobile-menu-trigger" aria-label="Open navigation"><Menu size={24} aria-hidden="true" /></SheetTrigger>
          <SheetContent side="right" className="opus-mobile-menu" overlayClassName="opus-mobile-menu-overlay">
            <SheetHeader>
              <SheetTitle><OpusWordmark className="opus-mobile-menu-wordmark" /><span className="sr-only">Anthropic navigation</span></SheetTitle>
              <SheetDescription className="sr-only">Explore Anthropic and try Claude.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation">
              {navigation.map((item) => {
                const groups = item.label in opusNavigationGroups ? opusNavigationGroups[item.label as keyof typeof opusNavigationGroups] : undefined
                return groups ? <details key={item.label} className="opus-mobile-menu-group"><summary className="opus-mobile-menu-link">{item.label}<ChevronDown size={14} aria-hidden="true" /></summary>{groups.map((group, index) => <div key={index} className="opus-mobile-submenu">{group.label && <p>{group.label}</p>}{group.links.map(link => <SheetClose key={link.href} render={<a href={link.href} />} className="opus-mobile-submenu-link">{link.label}</SheetClose>)}</div>)}</details> : <SheetClose key={item.label} render={<a href={item.href} />} className="opus-mobile-menu-link">{item.label}</SheetClose>
              })}
              <SheetClose render={<a href="https://claude.ai/" />} className="opus-mobile-menu-link">Try Claude</SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function OpusReadingNav({ sections }: { sections: readonly OpusSectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.anchor ?? "")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const markers = sections.map((section) => document.getElementById(section.anchor)).filter((element): element is HTMLElement => !!element)
    function update() {
      frame = 0
      let current = markers[0]?.id ?? ""
      for (const marker of markers) {
        if (marker.getBoundingClientRect().top <= window.innerHeight * 0.25) current = marker.id
      }
      setActive(current)
      const main = document.getElementById("main-content")?.getBoundingClientRect()
      setVisible(!!main && main.top < window.innerHeight * 0.5 && main.bottom > window.innerHeight * 0.5)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    update()
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
    }
  }, [sections])

  return (
    <nav className="opus-reading-nav" aria-label="On this page" data-visible={visible}>
      <ol>{sections.map((section) => <li key={section.anchor}><a href={`#${section.anchor}`} aria-current={active === section.anchor ? "location" : undefined}><span>{section.label}</span><span className="opus-reading-nav-mark" aria-hidden="true" /></a></li>)}</ol>
    </nav>
  )
}
