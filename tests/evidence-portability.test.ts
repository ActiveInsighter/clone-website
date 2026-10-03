import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"
import postcss from "postcss"
import tailwind from "@tailwindcss/postcss"
import { exportEvidence } from "../scripts/export-evidence.mjs"

const project = fileURLToPath(new URL("../", import.meta.url))

test("portable kit compiles without Next, project aliases or source-page assets", async () => {
  await mkdir(join(project, "dist"), { recursive: true })
  const directory = await mkdtemp(join(project, "dist/evidence-test-"))
  try {
    await exportEvidence(directory)
    const pkg = JSON.parse(await readFile(join(directory, "package.json"), "utf8"))
    assert.equal(pkg.dependencies.next, undefined)
    const types = await readFile(join(directory, "lib/components/evidence/index.d.ts"), "utf8")
    for (const name of ["BenchmarkTable", "PricingTable", "CostPerformanceChart", "ChartTabs", "BenchmarkBarChart", "TestimonialTabs", "ResponseComparison", "RichText"]) assert.ok(types.includes(name), name)
    const files = await readdir(join(directory, "src"), { recursive: true })
    assert.ok(!files.some(file => file.includes("sites/") || /\.(webp|woff2)$/.test(file)))
    for (const file of files.filter(file => /\.(ts|tsx)$/.test(file))) {
      const code = await readFile(join(directory, "src", file), "utf8")
      assert.ok(!code.includes('"@/'), file)
      assert.ok(!code.includes('"next/'), file)
    }
    const foundation = await readFile(join(directory, "src/styles.css"), "utf8")
    assert.ok(foundation.includes('@source "./components"'))
    assert.ok(!foundation.includes("--studio-"))
    const css = await postcss([tailwind()]).process(foundation, { from: join(directory, "src/styles.css") })
    assert.ok(css.css.includes("--evidence-paper"))
    assert.ok(css.css.includes("data-orientation"))
    assert.ok((await readFile(join(directory, "lib/components/evidence/chart.css"), "utf8")).includes(".evidence-chart"))
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test("export refuses to overwrite unrelated existing files", async () => {
  await mkdir(join(project, "dist"), { recursive: true })
  const directory = await mkdtemp(join(project, "dist/evidence-protect-"))
  try {
    await writeFile(join(directory, "important.txt"), "preserve me")
    await assert.rejects(exportEvidence(directory), /unrelated files/)
    assert.equal(await readFile(join(directory, "important.txt"), "utf8"), "preserve me")
  } finally { await rm(directory, { recursive: true, force: true }) }
})
