import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"

import type { RichTextProps } from "../src/components/evidence/rich-text"

// Transpile the real TSX module so the repository's dependency-free Node runner
// can exercise rendered output and URL handling without a browser test framework.
const source = await readFile(new URL("../src/components/evidence/rich-text.tsx", import.meta.url), "utf8")
const utilsUrl = "data:text/javascript," + encodeURIComponent("export function cn(...values) { return values.filter(Boolean).join(' ') }")
const compiled = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
  .replace(/import "\.\/editorial-widgets\.css";/, "")
  .replaceAll('"@/lib/utils"', JSON.stringify(utilsUrl))
  .replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve("react/jsx-runtime")))
  .replaceAll('"react"', JSON.stringify(import.meta.resolve("react")))

const { RichText, safeRichTextHref } = await import("data:text/javascript," + encodeURIComponent(compiled)) as {
  RichText: (props: RichTextProps) => ReturnType<typeof createElement>
  safeRichTextHref: (value: string) => string | undefined
}

test("rich text permits HTTP and relative links while rejecting executable and disguised schemes", () => {
  for (const href of ["https://example.com/a?x=1#top", "http://example.com", "/docs", "#note-1", "./guide", "../guide", "guide/page"]) {
    assert.equal(safeRichTextHref(href), href)
  }
  for (const href of ["javascript:alert(1)", "data:text/html,<script>", "vbscript:exec", "//evil.com", "/\\evil.com", "java\nscript:alert(1)", "https://user:secret@example.com", "https://", "mailto:user@example.com"]) {
    assert.equal(safeRichTextHref(href), undefined, href)
  }
})

test("rich text keeps semantic headings, combined marks, line breaks and safe links", () => {
  const html = renderToStaticMarkup(createElement(RichText, { blocks: [
    { id: "heading", style: "h2", spans: [{ text: "Section" }] },
    { id: "text", spans: [{ text: "Read\nthis", marks: ["strong", "em", "link"] }], links: { link: "/guide" } },
    { id: "note", spans: [{ text: "1", marks: ["sup"] }, { text: "2", marks: ["sub"] }] },
  ] }))
  assert.match(html, /<h2[^>]*>Section<\/h2>/)
  assert.match(html, /<a href="\/guide"><em><strong>Read<br\/>this<\/strong><\/em><\/a>/)
  assert.match(html, /<sup>1<\/sup><sub>2<\/sub>/)
})

test("untrusted text and code are escaped and unsafe links remain text", () => {
  const html = renderToStaticMarkup(createElement(RichText, { blocks: [
    { id: "unsafe", spans: [{ text: "<script>alert(1)</script>", marks: ["bad"] }], links: { bad: "javascript:alert(1)" } },
    { id: "code", code: "if (a < b) {\n  return '<img>';\n}", spans: [] },
  ] }))
  assert.doesNotMatch(html, /<script>|<img>|<a /)
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(html, /<pre[^>]*><code>if \(a &lt; b\) \{\n  return &#x27;&lt;img&gt;&#x27;;\n\}<\/code><\/pre>/)
})
