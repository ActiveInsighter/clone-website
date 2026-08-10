import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const theme = await readFile(
  new URL("src/components/openai-site/openai-navigation-theme.ts", root),
  "utf8",
);

test("OpenAI navigation keeps the original desktop and compact breakpoints", () => {
  assert.match(theme, /desktopBreakpoint:\s*[\"']1200px[\"']/);
  assert.match(theme, /compactBreakpoint:\s*[\"']900px[\"']/);
});
