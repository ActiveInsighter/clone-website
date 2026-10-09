import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import test from "node:test"
import { exportReadingMotion, makeReadingMotionRegistry } from "../scripts/export-reading-motion.mjs"
import { registryItemSchema } from "shadcn/schema"

test("reading motion kit compiles independently and contains every CSS/source dependency", async () => {
  await mkdir("dist", { recursive: true })
  const target = await mkdtemp("dist/reading-motion-test-")
  try {
    await exportReadingMotion(target)
    const files = await readdir(join(target, "src"), { recursive: true })
    for (const file of files.filter(file => /\.(ts|tsx)$/.test(file))) {
      const source = await readFile(join(target, "src", file), "utf8")
      assert.ok(!source.includes('"@/'), file)
      assert.ok(!source.includes('"next'), file)
      assert.ok(!source.includes("sites/"), file)
    }
    assert.ok(files.some(file => file.endsWith("reading-motion.module.css")))
    const types = await readFile(join(target, "lib/components/reading-motion/index.d.ts"), "utf8")
    assert.ok(types.includes("CursorHighlight"))
    assert.ok(types.includes("MotionParagraph"))
    const pkg = JSON.parse(await readFile(join(target, "package.json"), "utf8"))
    assert.equal(pkg.dependencies.next, undefined)
    assert.equal(pkg.peerDependencies.react, "^19.0.0")
  } finally { await rm(target, { recursive: true, force: true }) }
})

test("registry contains editable source with portable shadcn target placeholders", async () => {
  const item = await makeReadingMotionRegistry()
  registryItemSchema.parse(item)
  assert.equal(item.name, "reading-motion")
  assert.equal(item.type, "registry:component")
  assert.ok(item.files.some(file => file.path.endsWith("reading-motion.module.css")))
  assert.ok(item.files.every(file => file.target.startsWith("@components/reading-motion/")))
  assert.ok(item.files.every(file => file.content.length > 20))
})

test("export will not overwrite unrelated files", async () => {
  await mkdir("dist", { recursive: true })
  const target = await mkdtemp("dist/reading-motion-protect-")
  try {
    await writeFile(join(target, "important.txt"), "keep")
    await assert.rejects(exportReadingMotion(target), /unrelated/)
    assert.equal(await readFile(join(target, "important.txt"), "utf8"), "keep")
  } finally { await rm(target, { recursive: true, force: true }) }
})
