import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const navigationCss = await readFile(
  new URL("src/components/openai-navigation/responsive-navigation.css", root),
  "utf8",
);
const openAiCss = await readFile(
  new URL("src/components/openai-site/openai-navigation.css", root),
  "utf8",
);
const buttonSource = await readFile(
  new URL("src/components/ui/button.tsx", root),
  "utf8",
);
const responsiveNavigationSource = await readFile(
  new URL("src/components/openai-navigation/responsive-navigation.tsx", root),
  "utf8",
);
const sheetSource = await readFile(
  new URL("src/components/ui/sheet.tsx", root),
  "utf8",
);
const openAiNavigationSource = await readFile(
  new URL("src/components/openai-site/openai-top-nav.tsx", root),
  "utf8",
);

test("desktop navigation panels keep their content anchored while switching menus", () => {
  const panelItem = navigationCss.match(
    /\.site-navigation__panel-item\s*\{([\s\S]*?)\n\}/,
  )?.[1] ?? "";

  assert.doesNotMatch(panelItem, /transform:\s*translateY/);
});

test("OpenAI search icon swaps do not translate or rotate the icon", () => {
  const searchIcon = openAiCss.match(
    /\.openai-search-icon\s*\{([\s\S]*?)\n\}/,
  )?.[1] ?? "";

  assert.doesNotMatch(searchIcon, /transform:/);
});

test("mobile navigation levels reveal vertically instead of sliding horizontally", () => {
  assert.doesNotMatch(navigationCss, /site-navigation__mobile-drilldown[\s\S]*translateX/);
  assert.doesNotMatch(openAiCss, /openai-mobile-drilldown[\s\S]*translateX/);
});

test("shared buttons do not move vertically while being pressed", () => {
  assert.doesNotMatch(buttonSource, /active[^\n]*translate-y/);
});

test("shared mobile surface uses only the official 200ms clip-path reveal", () => {
  const surface = navigationCss.match(
    /\.site-navigation-mobile-surface\[data-slot="sheet-content"\]\s*\{([\s\S]*?)\n\}/,
  )?.[1] ?? "";

  assert.match(surface, /clip-path:\s*inset\(0 0 100% 0\)/);
  assert.match(surface, /transition:\s*clip-path 200ms cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
  assert.match(surface, /opacity:\s*1\s*!important/);
  assert.match(navigationCss, /\[data-open\]:not\(\[data-starting-style\]\):not\(\[data-ending-style\]\)/);
  assert.doesNotMatch(surface, /visibility|transform:\s*(?!none(?:\s|!important|$))\S/);
});

test("mobile navigation swaps one view at a time without animating its contents", () => {
  const sharedMobileMenu = responsiveNavigationSource.match(
    /function DefaultMobileMenu[\s\S]*?\n\}\n\nfunction defaultTrigger/,
  )?.[0] ?? "";
  const openAiMobileMenu = openAiNavigationSource.match(
    /function OpenAiMobileMenu[\s\S]*?\n\}\n\nexport function OpenAiTopNav/,
  )?.[0] ?? "";

  assert.doesNotMatch(sharedMobileMenu, /aria-hidden=\{!activeItem\}/);
  assert.doesNotMatch(openAiMobileMenu, /aria-hidden=\{!activeItem\}/);
  assert.match(sharedMobileMenu, /activeItem\s*\?\s*\(/);
  assert.match(openAiMobileMenu, /activeItem\s*\?\s*\(/);
});

test("OpenAI mobile surface uses the same clip-path-only reveal contract", () => {
  const surface = openAiCss.match(
    /\.openai-mobile-surface\.site-navigation-mobile-surface\[data-slot="sheet-content"\]\s*\{([\s\S]*?)\n\}/,
  )?.[1] ?? "";

  assert.match(surface, /clip-path:\s*inset\(0 0 100% 0\)/);
  assert.match(surface, /transition:\s*clip-path 200ms cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
  assert.match(surface, /opacity:\s*1\s*!important/);
  assert.match(openAiCss, /\[data-open\]:not\(\[data-starting-style\]\):not\(\[data-ending-style\]\)/);
  assert.doesNotMatch(surface, /visibility|transform:\s*(?!none(?:\s|!important|$))\S/);
});

test("OpenAI waits for the search clip-path close before revealing mobile navigation", () => {
  assert.match(openAiNavigationSource, /setMobileOpen\(true\);\s*\n\s*\}, 200\);/);
  assert.doesNotMatch(openAiNavigationSource, /setMobileOpen\(true\);\s*\n\s*\}, 360\);/);
});

test("shared mobile navigation locks the page scroll without exposing a scrollbar", () => {
  assert.match(navigationCss, /html:has\(\.site-navigation-mobile-surface\[data-slot="sheet-content"\]\[data-open\]\)/);
  assert.match(navigationCss, /overflow:\s*hidden\s*!important/);
  assert.match(navigationCss, /scrollbar-gutter:\s*auto\s*!important/);
  assert.match(navigationCss, /site-navigation__mobile-scroll \[data-slot="scroll-area-viewport"\][\s\S]*scrollbar-width:\s*none/);
  assert.match(navigationCss, /site-navigation-mobile-surface\[data-slot="sheet-content"\][\s\S]*width:\s*100vw\s*!important/);
});

test("mobile navigation disables Sheet's competing default motion", () => {
  assert.match(responsiveNavigationSource, /<SheetContent[\s\S]*disableMotion/);
  assert.match(sheetSource, /disableMotion\?: boolean/);
  assert.match(sheetSource, /!disableMotion\s*&&/);
});

test("OpenAI mobile close state keeps the same clip-path-only motion", () => {
  const endingStyle = openAiCss.match(
    /\.openai-mobile-surface\.site-navigation-mobile-surface\[data-slot="sheet-content"\]\[data-starting-style\]:not\(\[data-open\]\),[\s\S]*?\{([\s\S]*?)\n\}/,
  )?.[1] ?? "";

  assert.match(endingStyle, /clip-path:\s*inset\(0 0 100% 0\)/);
  assert.match(endingStyle, /opacity:\s*1\s*!important/);
  assert.match(endingStyle, /transition:\s*clip-path 200ms/);
  assert.doesNotMatch(endingStyle, /translateY|translateX|scale\(/);
});
