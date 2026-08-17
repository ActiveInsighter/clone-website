"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import {
  getNavigationViewportMode,
  resolveNavigationBreakpoint,
  type NavigationViewportMode,
} from "./navigation-mode";
import {
  canOpenNavigationMenu,
  reconcileNavigationStateForViewport,
  reduceNavigationState,
  type NavigationAction,
  type NavigationState,
} from "./navigation-state";
import type {
  MobileNavigationRenderContext,
  NavigationItemState,
  ResponsiveNavigationProps,
  SiteNavigationColumn,
  SiteNavigationItem,
  SiteNavigationLink,
} from "./navigation-types";

function isExternalLink(link: Pick<SiteNavigationLink, "external" | "href">): boolean {
  return Boolean(link.external || /^https?:\/\//.test(link.href));
}

function NavigationLink({
  link,
  className,
  children,
}: {
  link: SiteNavigationLink;
  className?: string;
  children?: ReactNode;
}) {
  const content = children ?? link.label;

  if (link.disabled) {
    return (
      <span aria-disabled="true" className={cn(className, "site-navigation__disabled-link")}>
        {content}
      </span>
    );
  }

  if (isExternalLink(link)) {
    return (
      <a
        className={className}
        href={link.href}
        rel="noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={link.href}>
      {content}
    </Link>
  );
}

function DefaultMenuPanel<Id extends string>({
  item,
  className,
}: {
  item: SiteNavigationItem<Id>;
  className?: string;
}) {
  const columns = item.menu?.columns ?? [];

  return (
    <div className={cn("site-navigation__panel-inner", className)} data-menu-panel={item.id}>
      {columns.map((column, index) => (
        <NavigationColumn column={column} key={column.id ?? String(column.title ?? index)} />
      ))}
    </div>
  );
}

function NavigationColumn({ column }: { column: SiteNavigationColumn }) {
  return (
    <section className="site-navigation__column">
      {column.title ? <h2 className="site-navigation__column-title">{column.title}</h2> : null}
      <ul className="site-navigation__column-list">
        {column.items.map((link, index) => (
          <li key={link.id ?? link.href + "-" + index}>
            <NavigationLink className="site-navigation__panel-link" link={link}>
              <span>{link.label}</span>
              {isExternalLink(link) ? (
                <span aria-hidden="true" className="site-navigation__external-mark">
                  ↗
                </span>
              ) : null}
            </NavigationLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DefaultMobileMenu<Id extends string>({
  items,
  openMenuId,
  openMobileMenu,
  closeMobileMenu,
  mobileContent,
  mobileActionsClassName,
}: MobileNavigationRenderContext<Id> & {
  mobileContent?: ReactNode;
  mobileActionsClassName?: string;
}) {
  const activeItem = items.find((item) => item.id === openMenuId) ?? null;

  return (
    <div className="site-navigation__mobile-body">
      <div
        className="site-navigation__mobile-drilldown"
        data-view={activeItem ? "subnav" : "root"}
      >
        {activeItem ? (
          <div className="site-navigation__mobile-subnav">
            <Button
              className="site-navigation__mobile-back"
              onClick={() => openMobileMenu(null)}
              type="button"
              variant="ghost"
            >
              <ArrowLeft aria-hidden="true" />
              返回
            </Button>
            <div className="site-navigation__mobile-subnav-title">{activeItem.label}</div>
            <DefaultMenuPanel item={activeItem} />
          </div>
        ) : (
          <nav aria-label="移动端导航" className="site-navigation__mobile-list">
            {items.map((item) => {
              const label = item.menuLabel ?? String(item.id) + " 菜单";

              return (
                <div className="site-navigation__mobile-item" key={item.id}>
                  {item.menu ? (
                    <Button
                      aria-label={label}
                      className="site-navigation__mobile-link"
                      disabled={item.disabled}
                      onClick={() => openMobileMenu(item.id)}
                      type="button"
                      variant="ghost"
                    >
                      <span>{item.label}</span>
                      <ChevronDown aria-hidden="true" />
                    </Button>
                  ) : (
                    <NavigationLink
                      className="site-navigation__mobile-link"
                      link={{
                        href: item.href ?? "#",
                        label: item.label,
                        external: item.external,
                        disabled: item.disabled,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      <div className={cn("site-navigation__mobile-actions", mobileActionsClassName)}>
        {mobileContent}
        <Button
          aria-label="关闭导航菜单"
          className="site-navigation__mobile-close"
          onClick={closeMobileMenu}
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" />
          关闭
        </Button>
      </div>
    </div>
  );
}

function defaultTrigger<Id extends string>(
  item: SiteNavigationItem<Id>,
  className: string,
  onClick: (event: MouseEvent<HTMLElement>) => void,
) {
  const props = {
    className,
    "data-navigation-trigger": "true",
    onClick,
  };

  if (item.disabled) {
    return (
      <span aria-disabled="true" className={cn(className, "site-navigation__disabled-link")}>
        {item.label}
      </span>
    );
  }

  if (item.href) {
    if (isExternalLink({ href: item.href, external: item.external })) {
      return (
        <a href={item.href} rel="noreferrer" target="_blank" {...props}>
          {item.label}
        </a>
      );
    }

    return (
      <Link href={item.href} {...props}>
        {item.label}
      </Link>
    );
  }

  return (
    <Button type="button" variant="ghost" {...props}>
      {item.label}
    </Button>
  );
}

export function ResponsiveNavigation<Id extends string = string>({
  ariaLabel = "Site navigation",
  skipLink,
  items,
  logo,
  endContent,
  mobileBarContent,
  mobileContent,
  mobileTriggerIcon,
  backdropContent,
  overlayContent,
  renderTrigger,
  renderMenu,
  renderMobileMenu,
  menuBehavior = "hover-focus",
  desktopBreakpoint = "900px",
  openMenuId: openMenuIdProp,
  defaultOpenMenuId = null,
  onOpenMenuChange,
  mobileOpen: mobileOpenProp,
  defaultMobileOpen = false,
  onMobileOpenChange,
  onViewportModeChange,
  compactContent,
  compactBreakpoint = "900px",
  onEscape,
  className,
  classNames,
  navigationEndContent,
}: ResponsiveNavigationProps<Id>) {
  const navigationId = useId().replace(/:/g, "-");
  const panelId = "site-navigation-panel" + navigationId;
  const rootRef = useRef<HTMLElement | null>(null);
  const panelStageRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [hoverClosePending, setHoverClosePending] = useState(false);
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window === "undefined"
      ? "mobile"
      : getNavigationViewportMode(
          window.innerWidth,
          resolveNavigationBreakpoint(desktopBreakpoint),
          resolveNavigationBreakpoint(compactBreakpoint),
        ),
  );
  const [focusedItemId, setFocusedItemId] = useState<Id | null>(null);
  const [lastTriggerItemId, setLastTriggerItemId] = useState<Id | null>(null);
  const [lastTriggerKind, setLastTriggerKind] = useState<"trigger" | "menu-button">("trigger");
  const [internalState, setInternalState] = useState<NavigationState<Id>>({
    openMenuId: defaultOpenMenuId,
    mobileOpen: defaultMobileOpen,
    mobileMenuId: null,
  });

  useEffect(() => {
    const updateViewportMode = () => {
      const nextMode = getNavigationViewportMode(
        window.innerWidth,
        resolveNavigationBreakpoint(desktopBreakpoint),
        resolveNavigationBreakpoint(compactBreakpoint),
      );

      setViewportMode(nextMode);
      setInternalState((current) => reconcileNavigationStateForViewport(current, nextMode));
    };

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, [compactBreakpoint, desktopBreakpoint]);

  const state = useMemo<NavigationState<Id>>(
    () => ({
      openMenuId: openMenuIdProp === undefined ? internalState.openMenuId : openMenuIdProp,
      mobileOpen: mobileOpenProp === undefined ? internalState.mobileOpen : mobileOpenProp,
      mobileMenuId: internalState.mobileMenuId,
    }),
    [internalState, mobileOpenProp, openMenuIdProp],
  );

  const dispatch = useCallback(
    (action: NavigationAction<Id>) => {
      const nextState = reduceNavigationState(state, action);

      setInternalState((current) => reduceNavigationState(current, action));

      if (nextState.openMenuId !== state.openMenuId) {
        onOpenMenuChange?.(nextState.openMenuId);
      }
      if (nextState.mobileOpen !== state.mobileOpen) {
        onMobileOpenChange?.(nextState.mobileOpen);
      }
    },
    [onMobileOpenChange, onOpenMenuChange, state],
  );

  const lastViewportMode = useRef<NavigationViewportMode | null>(null);

  useEffect(() => {
    const modeChanged = lastViewportMode.current !== viewportMode;
    lastViewportMode.current = viewportMode;

    if (!modeChanged) return;

    const nextState = reconcileNavigationStateForViewport(state, viewportMode);

    if (nextState.openMenuId !== state.openMenuId) {
      onOpenMenuChange?.(nextState.openMenuId);
    }
    if (nextState.mobileOpen !== state.mobileOpen) {
      onMobileOpenChange?.(nextState.mobileOpen);
    }

    onViewportModeChange?.(viewportMode);
  }, [
    onMobileOpenChange,
    onOpenMenuChange,
    onViewportModeChange,
    state,
    viewportMode,
  ]);

  const closeMenu = useCallback(() => {
    dispatch({ type: "open-menu", id: null });
  }, [dispatch]);

  const cancelHoverClose = useCallback(() => {
    setHoverClosePending(false);
  }, []);

  const scheduleHoverClose = useCallback(() => {
    setHoverClosePending(true);
  }, []);

  useEffect(() => {
    if (!hoverClosePending) return;

    const timer = window.setTimeout(() => {
      if (rootRef.current?.matches(":hover")) {
        setHoverClosePending(false);
        return;
      }

      setHoverClosePending(false);
      closeMenu();
    }, 140);

    return () => window.clearTimeout(timer);
  }, [closeMenu, hoverClosePending]);

  const closeMobileMenu = useCallback(() => {
    dispatch({ type: "set-mobile-open", open: false });
  }, [dispatch]);

  const openMobileMenu = useCallback(
    (id: Id | null) => {
      dispatch({ type: "set-mobile-menu", id });
    },
    [dispatch],
  );

  const openMenuForItem = useCallback(
    (item: SiteNavigationItem<Id>, source?: HTMLElement | null) => {
      if (!canOpenNavigationMenu(item)) return;

      cancelHoverClose();

      if (source) {
        setLastTriggerItemId(item.id);
        setLastTriggerKind(
          source.matches("[data-navigation-menu-button]") ? "menu-button" : "trigger",
        );
      }
      dispatch({ type: "open-menu", id: item.id });
    },
    [cancelHoverClose, dispatch],
  );

  const focusLastTrigger = useCallback(() => {
    const item = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-menu-id]") ?? [],
    ).find((element) => element.getAttribute("data-menu-id") === String(lastTriggerItemId));
    const selector = lastTriggerKind === "menu-button"
      ? "[data-navigation-menu-button]"
      : "[data-navigation-trigger]";
    const trigger = item?.querySelector<HTMLElement>(selector);

    if (trigger) {
      trigger.focus();
    }
  }, [lastTriggerItemId, lastTriggerKind]);

  useEffect(() => {
    // Consumers can own an additional overlay state (for example a search
    // panel) and use onEscape to close it. Keep the document listener alive
    // for that case even when the navigation itself is idle.
    if (!state.openMenuId && !state.mobileOpen && !onEscape) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      if (state.openMenuId || state.mobileOpen) {
        dispatch({ type: "escape" });
      }
      onEscape?.();
      if (state.openMenuId || state.mobileOpen) {
        focusLastTrigger();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, focusLastTrigger, onEscape, state.mobileOpen, state.openMenuId]);

  const handleRootBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (
      !(nextTarget instanceof Element) ||
      !nextTarget.closest(".site-navigation")
    ) {
      setFocusedItemId(null);
      closeMenu();
    }
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch({ type: "escape" });
      onEscape?.();
      focusLastTrigger();
    }
  };

  const hoverEnabled = menuBehavior !== "click";
  const clickEnabled = menuBehavior !== "hover-focus";
  const activeItem = items.find((item) => item.id === state.openMenuId) ?? null;
  const hasOpenMenu = Boolean(activeItem);

  useLayoutEffect(() => {
    const stage = panelStageRef.current;

    if (!stage || !activeItem) {
      const frame = window.requestAnimationFrame(() => setPanelHeight(0));
      return () => window.cancelAnimationFrame(frame);
    }

    const activePanel = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-navigation-panel-item]"),
    ).find((panel) => panel.dataset.navigationPanelItem === String(activeItem.id));

    if (!activePanel) return;

    const measure = () => setPanelHeight(activePanel.scrollHeight);
    const frame = window.requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(activePanel);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeItem, renderMenu]);

  return (
    <Sheet
      onOpenChange={(open) => {
        dispatch({ type: "set-mobile-open", open });
      }}
      open={state.mobileOpen}
    >
      <header
        aria-label={ariaLabel}
        className={cn("site-navigation", classNames?.root, className)}
        data-breakpoint={desktopBreakpoint}
        data-compact-breakpoint={compactBreakpoint}
        data-mobile-open={state.mobileOpen}
        ref={rootRef}
        onBlurCapture={handleRootBlur}
        onKeyDownCapture={handleRootKeyDown}
      >
        {skipLink ? (
          <a className="site-navigation__skip-link" href={skipLink.href}>
            {skipLink.label}
          </a>
        ) : null}

        <div
          className={cn("site-navigation__bar", classNames?.bar)}
          onMouseEnter={cancelHoverClose}
          onMouseLeave={() => {
            if (hoverEnabled) scheduleHoverClose();
          }}
        >
          <div className={cn("site-navigation__bar-inner", classNames?.barInner)}>
            <div className={cn("site-navigation__brand", classNames?.brand)}>{logo}</div>

            <div className={cn("site-navigation__desktop", classNames?.desktop)}>
              <nav aria-label={ariaLabel} className={classNames?.navigation}>
                <ul
                  className={cn("site-navigation__list", classNames?.list)}
                  data-has-open={hasOpenMenu}
                >
                  {items.map((item) => {
                    const open = state.openMenuId === item.id;
                    const focused = focusedItemId === item.id;
                    const toggleMenu = () => {
                      if (!canOpenNavigationMenu(item)) return;
                      if (state.openMenuId === item.id) {
                        closeMenu();
                      } else {
                        openMenuForItem(item);
                      }
                    };
                    const itemState: NavigationItemState = {
                      open,
                      focused,
                      disabled: Boolean(item.disabled),
                      openMenu: () => openMenuForItem(item),
                      closeMenu,
                      toggleMenu,
                    };
                    const triggerClick = (event: MouseEvent<HTMLElement>) => {
                      if (item.menu && !item.href) {
                        event.preventDefault();
                        toggleMenu();
                      }
                    };

                    return (
                      <li
                        className={cn("site-navigation__item", classNames?.item)}
                        data-menu-open={open}
                        data-menu-id={item.id}
                        key={item.id}
                        onFocusCapture={(event) => {
                          cancelHoverClose();
                          setFocusedItemId(item.id);
                          if (item.menu) {
                            const itemElement = (event.target as HTMLElement).closest(
                              "[data-menu-id]",
                            );
                            const focusedControl = (event.target as HTMLElement).closest(
                              "[data-navigation-menu-button], [data-navigation-trigger]",
                            );
                            const trigger = focusedControl ?? itemElement?.querySelector(
                              "[data-navigation-trigger]",
                            );
                            openMenuForItem(item, trigger instanceof HTMLElement ? trigger : null);
                          }
                        }}
                        onMouseEnter={(event) => {
                          if (hoverEnabled) {
                            cancelHoverClose();
                            const itemElement = (event.target as HTMLElement).closest(
                              "[data-menu-id]",
                            );
                            const hoveredControl = (event.target as HTMLElement).closest(
                              "[data-navigation-menu-button], [data-navigation-trigger]",
                            );
                            const trigger = hoveredControl ?? itemElement?.querySelector(
                              "[data-navigation-trigger]",
                            );
                            openMenuForItem(item, trigger instanceof HTMLElement ? trigger : null);
                          }
                        }}
                        onBlur={(event) => {
                          const itemElement = (event.target as HTMLElement).closest(
                            "[data-menu-id]",
                          );
                          if (!itemElement?.contains(event.relatedTarget as Node | null)) {
                            setFocusedItemId(null);
                          }
                        }}
                      >
                        {renderTrigger
                          ? renderTrigger(item, itemState)
                          : defaultTrigger(item, cn("site-navigation__trigger", classNames?.trigger), triggerClick)}
                        {item.menu ? (
                          <Button
                            aria-controls={panelId}
                            aria-expanded={open}
                            aria-label={item.menuLabel ?? String(item.id) + " menu"}
                            aria-haspopup="menu"
                            className={cn("site-navigation__menu-button", classNames?.menuButton)}
                            data-clickable={clickEnabled}
                            data-navigation-menu-button="true"
                            disabled={item.disabled}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (clickEnabled) {
                                toggleMenu();
                              } else {
                                const button = (event.target as HTMLElement).closest(
                                  "[data-navigation-menu-button]",
                                );
                                openMenuForItem(
                                  item,
                                  button instanceof HTMLElement ? button : null,
                                );
                              }
                            }}
                            type="button"
                            variant="ghost"
                          >
                            <ChevronDown aria-hidden="true" />
                          </Button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {navigationEndContent ? (
                <div className="site-navigation__navigation-end">
                  {navigationEndContent}
                </div>
              ) : null}
              <div className={cn("site-navigation__actions", classNames?.actions)}>
                {endContent}
              </div>
            </div>

            <div className="site-navigation__compact">
              {compactContent}
              <Button
                aria-expanded={state.mobileOpen}
                aria-label={state.mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
                className={cn("site-navigation__mobile-trigger", classNames?.mobileTrigger)}
                onClick={() => dispatch({ type: "set-mobile-open", open: !state.mobileOpen })}
                type="button"
                variant="ghost"
              >
                {state.mobileOpen ? (
                  <X aria-hidden="true" />
                ) : (
                  mobileTriggerIcon ?? <Menu aria-hidden="true" />
                )}
              </Button>
            </div>

            <div className={cn("site-navigation__mobile-toggle", classNames?.mobileToggle)}>
              {mobileBarContent}
              <Button
                aria-expanded={state.mobileOpen}
                aria-label={state.mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
                className={cn("site-navigation__mobile-trigger", classNames?.mobileTrigger)}
                onClick={() => dispatch({ type: "set-mobile-open", open: !state.mobileOpen })}
                type="button"
                variant="ghost"
              >
                {state.mobileOpen ? (
                  <X aria-hidden="true" />
                ) : (
                  mobileTriggerIcon ?? <Menu aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {backdropContent !== undefined ? (
          <div
            aria-hidden="true"
            className="site-navigation__backdrop"
            data-state={hasOpenMenu ? "open" : "closed"}
            onClick={closeMenu}
          >
            {backdropContent}
          </div>
        ) : null}

        <div
          aria-hidden={!activeItem}
          aria-label={activeItem ? String(activeItem.label) + " menu" : undefined}
          className={cn("site-navigation__panel", classNames?.panel)}
          data-state={activeItem ? "open" : "closed"}
          id={panelId}
          onMouseEnter={() => {
            cancelHoverClose();
            if (activeItem) openMenuForItem(activeItem);
          }}
          onMouseLeave={() => {
            if (hoverEnabled) scheduleHoverClose();
          }}
          role="region"
          style={{ "--site-navigation-panel-height": `${panelHeight}px` } as CSSProperties}
        >
          <div className="site-navigation__panel-stage" ref={panelStageRef}>
            {items.map((item) => {
              if (!item.menu) return null;
              const itemIsActive = item.id === state.openMenuId;

              return (
                <div
                  aria-hidden={!itemIsActive}
                  className="site-navigation__panel-item"
                  data-active={itemIsActive}
                  data-navigation-panel-item={item.id}
                  inert={!itemIsActive}
                  key={item.id}
                >
                  {renderMenu
                    ? renderMenu(item, { openMenuId: state.openMenuId, closeMenu })
                    : <DefaultMenuPanel item={item} />}
                </div>
              );
            })}
          </div>
        </div>

        <SheetContent
          aria-label={ariaLabel}
          className={cn("site-navigation-mobile-surface", classNames?.mobile)}
          disableMotion
          overlayClassName="site-navigation-mobile-overlay"
          showCloseButton={false}
          side="top"
        >
          <SheetTitle className="sr-only">{ariaLabel}</SheetTitle>
          <SheetDescription className="sr-only">
            Responsive navigation menu
          </SheetDescription>
          <ScrollArea className="site-navigation__mobile-scroll">
            {renderMobileMenu ? (
              renderMobileMenu({
                items,
                openMenuId: state.mobileMenuId,
                openMobileMenu,
                closeMobileMenu,
              })
            ) : (
              <DefaultMobileMenu
                closeMobileMenu={closeMobileMenu}
                items={items}
                mobileActionsClassName={classNames?.mobileActions}
                mobileContent={mobileContent}
                openMenuId={state.mobileMenuId}
                openMobileMenu={openMobileMenu}
              />
            )}
            {renderMobileMenu && mobileContent ? (
              <div className={cn("site-navigation__mobile-actions", classNames?.mobileActions)}>{mobileContent}</div>
            ) : null}
          </ScrollArea>
        </SheetContent>

        {overlayContent}
      </header>
    </Sheet>
  );
}
