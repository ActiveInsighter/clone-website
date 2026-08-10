import test from "node:test";
import assert from "node:assert/strict";

import { getNavigationViewportMode } from "../src/components/navigation/navigation-mode.ts";

test("uses desktop mode at and above the desktop breakpoint", () => {
  assert.equal(getNavigationViewportMode(1200), "desktop");
});

test("uses compact mode between compact and desktop breakpoints", () => {
  assert.equal(getNavigationViewportMode(900), "compact");
  assert.equal(getNavigationViewportMode(1199), "compact");
});

test("uses mobile mode below the compact breakpoint", () => {
  assert.equal(getNavigationViewportMode(899), "mobile");
});

test("supports custom numeric breakpoints", () => {
  assert.equal(getNavigationViewportMode(700, 1024, 768), "mobile");
  assert.equal(getNavigationViewportMode(900, 1024, 768), "compact");
  assert.equal(getNavigationViewportMode(1024, 1024, 768), "desktop");
});
