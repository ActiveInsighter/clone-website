import test from "node:test";
import assert from "node:assert/strict";

import {
  reconcileNavigationStateForViewport,
  reduceNavigationState,
} from "../src/components/openai-navigation/navigation-state.ts";

const base = {
  openMenuId: null,
  mobileOpen: false,
  mobileMenuId: null,
};

test("opening a desktop disclosure closes mobile navigation and resets its submenu", () => {
  const state = { openMenuId: null, mobileOpen: true, mobileMenuId: "products" };
  assert.deepEqual(
    reduceNavigationState(state, { type: "open-menu", id: "developers" }),
    { openMenuId: "developers", mobileOpen: false, mobileMenuId: null },
  );
});

test("opening mobile navigation closes any desktop disclosure", () => {
  const state = { ...base, openMenuId: "research" };
  assert.deepEqual(
    reduceNavigationState(state, { type: "set-mobile-open", open: true }),
    { openMenuId: null, mobileOpen: true, mobileMenuId: null },
  );
});

test("closing mobile navigation always returns its drill-down to the root view", () => {
  const state = { openMenuId: null, mobileOpen: true, mobileMenuId: "developers" };
  assert.deepEqual(
    reduceNavigationState(state, { type: "set-mobile-open", open: false }),
    base,
  );
});

test("opening a mobile submenu guarantees the mobile surface is open", () => {
  assert.deepEqual(
    reduceNavigationState(base, { type: "set-mobile-menu", id: "company" }),
    { openMenuId: null, mobileOpen: true, mobileMenuId: "company" },
  );
});

test("Escape resets every navigation-owned surface", () => {
  const state = { openMenuId: "products", mobileOpen: true, mobileMenuId: "company" };
  assert.deepEqual(reduceNavigationState(state, { type: "escape" }), base);
});

test("resizing to desktop closes both mobile navigation and desktop disclosures", () => {
  const state = { openMenuId: "products", mobileOpen: true, mobileMenuId: "company" };

  assert.deepEqual(
    reconcileNavigationStateForViewport(state, "desktop"),
    base,
  );
});

test("resizing to compact closes every expanded surface without opening mobile navigation", () => {
  const state = { openMenuId: "products", mobileOpen: true, mobileMenuId: "company" };

  assert.deepEqual(
    reconcileNavigationStateForViewport(state, "compact"),
    { openMenuId: null, mobileOpen: false, mobileMenuId: null },
  );
});
