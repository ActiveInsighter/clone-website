"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowUpRight, ChevronDown, Search, X } from "lucide-react";

import { ResponsiveNavigation } from "@/components/navigation/responsive-navigation";
import { Button } from "@/components/ui/button";
import {
  openAiLoginItems,
  openAiMenus,
  toOpenAiNavigationItems,
  type OpenAiMenuGroup,
} from "./openai-navigation-data";
import { openAiNavigationTheme } from "./openai-navigation-theme";

type OpenAiTopNavProps = {
  menus?: OpenAiMenuGroup[];
  ctaHref?: string;
  ctaLabel?: string;
};

const logoPath =
  "M30.6.398C13.77.398 0 14.168 0 30.998s13.77 30.6 30.6 30.6 30.6-13.685 30.6-30.6S47.515.398 30.6.398m0 50.235c-10.455 0-18.87-8.585-18.87-19.635s8.415-19.635 18.87-19.635 18.87 8.585 18.87 19.635-8.415 19.635-18.87 19.635m61.54-33.235c-5.526 0-10.88 2.21-13.686 5.95v-5.1h-11.05v59.5h11.05V56.243c2.805 3.485 7.99 5.355 13.685 5.355 11.9 0 21.25-9.35 21.25-22.1s-9.35-22.1-21.25-22.1m-1.87 34.595c-6.29 0-11.9-4.93-11.9-12.495s5.61-12.495 11.9-12.495 11.899 4.93 11.899 12.495-5.61 12.495-11.9 12.495m49.133-34.595c-12.07 0-21.59 9.435-21.59 22.1s8.33 22.1 21.93 22.1c11.135 0 18.275-6.715 20.485-14.28h-10.795c-1.36 3.145-5.185 5.355-9.775 5.355-5.695 0-10.03-3.995-11.05-9.69h32.13v-4.335c0-11.56-8.075-21.25-21.335-21.25m-10.71 17.765c1.19-5.355 5.61-8.84 10.965-8.84 5.695 0 10.03 3.74 10.54 8.84zm61.454-17.765c-4.93 0-10.115 2.21-12.495 5.865v-5.015H166.6v42.5h11.05V37.883c0-6.63 3.57-10.965 9.35-10.965 5.355 0 8.245 4.08 8.245 9.775v24.055h11.05v-25.84c0-10.54-6.46-17.51-16.15-17.51M234.596 1.25l-24.055 59.5h11.815l5.1-13.005h27.37l5.1 13.005h11.985l-23.885-59.5zm-3.315 36.635 9.86-24.905 9.775 24.905zM287.636 1.25h-11.22v59.5h11.22z";

function OpenAiLogo() {
  return (
    <svg aria-hidden="true" className="openai-logo" fill="none" viewBox="0 0 288 78">
      <path d={logoPath} fill="currentColor" />
    </svg>
  );
}

function OpenAiMenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="openai-menu-icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect height="16" rx="4" stroke="currentColor" strokeWidth="1.5" width="16" x="4" y="4" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ExternalLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="openai-inline-arrow" />
      <span className="sr-only">（在新窗口中打开）</span>
    </>
  );
}

function SearchControl({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      aria-expanded={open}
      aria-label={open ? "关闭搜索" : "打开搜索"}
      className="openai-icon-button"
      onClick={onToggle}
      size="icon"
      type="button"
      variant="ghost"
    >
      <span aria-hidden="true" className="openai-search-icon" data-state={open ? "closed" : "open"}>
        <Search />
      </span>
      <span aria-hidden="true" className="openai-search-icon" data-state={open ? "open" : "closed"}>
        <X />
      </span>
    </Button>
  );
}

function OpenAiLoginMenu({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const menuId = `openai-login-menu-${useId().replace(/:/g, "-")}`;

  return (
    <div className="openai-login-root" data-openai-login-root="true">
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="openai-pill-button openai-login-button"
        data-popup-open={open ? "true" : undefined}
        onClick={onToggle}
        type="button"
      >
        登录
        <ChevronDown aria-hidden="true" />
      </button>
      <div
        aria-hidden={!open}
        className="openai-login-menu"
        data-state={open ? "open" : "closed"}
        id={menuId}
        role="menu"
      >
        {openAiLoginItems.map((item) => (
          <a
            href={item.href}
            key={item.label}
            rel="noreferrer"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            target="_blank"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ChatGptCta({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="openai-pill-button openai-cta-button"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {label}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function OpenAiSearchPanel({ open, inputId }: { open: boolean; inputId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div
      aria-label="搜索 OpenAI"
      aria-hidden={!open}
      className="openai-search-panel"
      data-state={open ? "open" : "closed"}
      role="region"
    >
      <div className="openai-search-panel-inner">
        <form
          className="openai-search-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor={inputId}>
            搜索 OpenAI
          </label>
          <input
            id={inputId}
            ref={inputRef}
            placeholder="咨询 OpenAI 研究相关问题"
            tabIndex={open ? 0 : -1}
            type="search"
          />
          <button aria-label="提交搜索" type="submit">
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

function OpenAiMobileMenu({
  items,
  openMenuId,
  openMobileMenu,
}: {
  items: ReturnType<typeof toOpenAiNavigationItems>;
  openMenuId: ReturnType<typeof toOpenAiNavigationItems>[number]["id"] | null;
  openMobileMenu: (id: ReturnType<typeof toOpenAiNavigationItems>[number]["id"] | null) => void;
}) {
  const activeItem = items.find((item) => item.id === openMenuId) ?? null;

  return (
    <div className="openai-mobile-body">
      <div className="openai-mobile-drilldown" data-view={activeItem ? "subnav" : "root"}>
        {activeItem ? (
          <div className="openai-mobile-subnav">
            <button
              className="openai-mobile-home-link"
              onClick={() => openMobileMenu(null)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" />
              首页
            </button>
            <p className="openai-mobile-subnav-label">{activeItem.label}</p>
            <div className="openai-mobile-subnav-groups">
              {activeItem.menu?.columns.map((column) => (
                <section key={column.id ?? String(column.title)}>
                  {column.title ? <h2>{column.title}</h2> : null}
                  <div>
                    {column.items.map((link) => (
                      <a
                        href={link.href}
                        key={link.id ?? link.href}
                        rel={link.external ? "noreferrer" : undefined}
                        target={link.external ? "_blank" : undefined}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <nav aria-label="移动端导航" className="openai-mobile-list">
            {items.map((item) =>
              item.menu ? (
                <button
                  key={item.id}
                  onClick={() => openMobileMenu(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.href}
                  key={item.id}
                  rel={item.external ? "noreferrer" : undefined}
                  target={item.external ? "_blank" : undefined}
                >
                  {item.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ),
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

export function OpenAiTopNav({
  menus = openAiMenus,
  ctaHref = "https://chatgpt.com/",
  ctaLabel = "试用 ChatGPT",
}: OpenAiTopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<ReturnType<typeof toOpenAiNavigationItems>[number]["id"] | null>(null);
  const mobileOpenTimerRef = useRef<number | null>(null);
  const searchInputId = `openai-site-search-${useId().replace(/:/g, "-")}`;
  const navigationItems = useMemo(
    () =>
      toOpenAiNavigationItems(menus).map((item) =>
        item.id === "foundation"
          ? { ...item, label: <ExternalLabel>基金会</ExternalLabel> }
          : item,
      ),
    [menus],
  );
  useEffect(() => {
    const closeOnOutsidePointer = (event: globalThis.PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-openai-login-root]")) return;
      setLoginOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  useEffect(() => () => {
    if (mobileOpenTimerRef.current !== null) {
      window.clearTimeout(mobileOpenTimerRef.current);
    }
  }, []);

  const requestMobileOpen = useCallback((open: boolean) => {
    if (mobileOpenTimerRef.current !== null) {
      window.clearTimeout(mobileOpenTimerRef.current);
      mobileOpenTimerRef.current = null;
    }

    if (open && searchOpen) {
      setSearchOpen(false);
      mobileOpenTimerRef.current = window.setTimeout(() => {
        mobileOpenTimerRef.current = null;
        setMobileOpen(true);
      }, 200);
      return;
    }

    setMobileOpen(open);
  }, [searchOpen]);

  const toggleSearch = () => {
    setSearchOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) {
        requestMobileOpen(false);
        setOpenMenuId(null);
        setLoginOpen(false);
      }
      return nextOpen;
    });
  };
  const toggleLogin = () => {
    setLoginOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) {
        setSearchOpen(false);
        setOpenMenuId(null);
      }
      return nextOpen;
    });
  };
  const desktopSearch = (
    <div className="openai-search-control">
      <SearchControl onToggle={toggleSearch} open={searchOpen} />
    </div>
  );
  const actionContent = (
    <>
      <OpenAiLoginMenu onToggle={toggleLogin} open={loginOpen} />
      <ChatGptCta href={ctaHref} label={ctaLabel} />
    </>
  );
  const compactContent = (
    <>
      <div className="openai-search-control">
        <SearchControl onToggle={toggleSearch} open={searchOpen} />
      </div>
      <OpenAiLoginMenu onToggle={toggleLogin} open={loginOpen} />
      <ChatGptCta href={ctaHref} label={ctaLabel} />
    </>
  );

  return (
    <ResponsiveNavigation
      ariaLabel="主导航"
      className={openAiNavigationTheme.className}
      classNames={openAiNavigationTheme.classNames}
      compactBreakpoint={openAiNavigationTheme.compactBreakpoint}
      desktopBreakpoint={openAiNavigationTheme.desktopBreakpoint}
      endContent={actionContent}
      items={navigationItems}
      logo={
        <Link
          aria-label="OpenAI 主页"
          className="openai-brand-link"
          href="/zh-Hans-CN/"
        >
          <OpenAiLogo />
        </Link>
      }
      compactContent={compactContent}
      navigationEndContent={desktopSearch}
      mobileBarContent={
        <SearchControl onToggle={toggleSearch} open={searchOpen} />
      }
      mobileContent={
        <>
          <ChatGptCta href={ctaHref} label={ctaLabel} />
          <OpenAiLoginMenu onToggle={toggleLogin} open={loginOpen} />
        </>
      }
      mobileTriggerIcon={<OpenAiMenuIcon />}
      mobileOpen={mobileOpen}
      onEscape={() => {
        setSearchOpen(false);
        setLoginOpen(false);
        setMobileOpen(false);
      }}
      onMobileOpenChange={(open) => {
        if (open) {
          requestMobileOpen(true);
          setLoginOpen(false);
          setOpenMenuId(null);
        } else {
          requestMobileOpen(false);
        }
      }}
      onViewportModeChange={() => {
        setSearchOpen(false);
        setLoginOpen(false);
      }}
      onOpenMenuChange={(id) => {
        setOpenMenuId(id);
        if (id) {
          setSearchOpen(false);
          setLoginOpen(false);
        }
      }}
      openMenuId={openMenuId}
      overlayContent={
        <OpenAiSearchPanel inputId={searchInputId} open={searchOpen} />
      }
      backdropContent={<span />}
      renderMobileMenu={(context) => (
        <OpenAiMobileMenu
          items={context.items}
          openMenuId={context.openMenuId}
          openMobileMenu={context.openMobileMenu}
        />
      )}
      skipLink={{ href: "#main", label: "跳至主要内容" }}
    />
  );
}
