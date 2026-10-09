import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const project = fileURLToPath(new URL("../", import.meta.url))
const source = join(project, "src/components/reading-motion")
const marker = ".reading-motion-export.json"

async function sourceFiles() {
  const names = (await readdir(source)).filter(file => /\.(ts|tsx|css)$/.test(file))
  const files = await Promise.all(names.map(async name => ({ name, content: (await readFile(join(source, name), "utf8")).replaceAll('"@/lib/utils"', '"./utils"') })))
  files.push({ name: "utils.ts", content: await readFile(join(project, "src/lib/utils.ts"), "utf8") })
  return files
}

export async function makeReadingMotionRegistry() {
  const files = await sourceFiles()
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "reading-motion", type: "registry:component", title: "Reading motion",
    description: "Scroll-driven cursor selection and paragraph placement with controlled playback, rich text and reduced-motion support.",
    dependencies: ["clsx", "tailwind-merge"],
    files: files.map(({ name, content }) => ({ path: `registry/reading-motion/${name}`, target: `@components/reading-motion/${name}`, type: name.endsWith(".css") ? "registry:file" : "registry:component", content })),
    docs: "Requires React 19 and CSS Modules. Import CursorHighlight / MotionParagraph from your components/reading-motion folder. Docs: https://clone-website-lab.2212148739lbw.workers.dev/components/reading-motion (接入代码).",
  }
}

/** A bundler-ready package independent of Next, Tailwind, site content and aliases. */
export async function exportReadingMotion(destination) {
  const output = resolve(destination)
  if (output === project || project.startsWith(`${output}/`) || output === join(project, "src") || output.startsWith(join(project, "src") + "/")) throw new Error("Export must be outside application source.")
  await mkdir(output, { recursive: true })
  const existing = await readdir(output)
  if (existing.length && !existing.includes(marker)) throw new Error("Destination contains unrelated files.")
  await writeFile(join(output, marker), JSON.stringify({ version: 1 }))
  const files = await sourceFiles()
  const target = join(output, "src/components/reading-motion")
  await mkdir(target, { recursive: true })
  for (const { name, content } of files) await writeFile(join(target, name), content)
  await writeFile(join(output, "src/index.ts"), 'export * from "./components/reading-motion"\n')
  await writeFile(join(output, "src/css-modules.d.ts"), 'declare module "*.module.css" { const classes: Record<string, string>; export default classes }\n')
  const app = JSON.parse(await readFile(join(project, "package.json"), "utf8"))
  const pkg = {
    name: "@clone-lab/reading-motion", version: "0.1.0", private: true, type: "module", license: "MIT",
    description: "Reusable cursor highlights and paragraph placement for React/shadcn.",
    exports: { ".": { types: "./lib/index.d.ts", import: "./lib/index.js" } },
    files: ["src", "lib", "README.md", "LICENSE", "tsconfig.json"], sideEffects: ["**/*.css"],
    peerDependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
    dependencies: { clsx: app.dependencies.clsx, "tailwind-merge": app.dependencies["tailwind-merge"] },
  }
  await writeFile(join(output, "package.json"), JSON.stringify(pkg, null, 2) + "\n")
  await writeFile(join(output, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["ESNext", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: true, esModuleInterop: true, declaration: true, rootDir: "src", outDir: "lib" }, include: ["src/**/*.ts", "src/**/*.tsx"] }, null, 2) + "\n")
  await copyFile(join(project, "LICENSE"), join(output, "LICENSE"))
  await copyFile(join(project, "docs/components/reading-motion.md"), join(output, "README.md"))
  const result = spawnSync(process.execPath, [join(project, "node_modules/typescript/bin/tsc"), "-p", join(output, "tsconfig.json")], { encoding: "utf8" })
  if (result.status !== 0) throw new Error(`Portable kit compilation failed:\n${result.stdout}${result.stderr}`)
  const compiled = join(output, "lib/components/reading-motion")
  await mkdir(compiled, { recursive: true })
  for (const { name, content } of files.filter(file => file.name.endsWith(".css"))) await writeFile(join(compiled, name), content)
  return output
}

async function main() {
  const output = await exportReadingMotion(join(project, "dist/reading-motion-kit"))
  await mkdir(join(project, "public/r"), { recursive: true })
  await writeFile(join(project, "public/r/reading-motion.json"), JSON.stringify(await makeReadingMotionRegistry(), null, 2) + "\n")
  const archive = join(project, "public/downloads/reading-motion-kit.tar.gz")
  await mkdir(dirname(archive), { recursive: true })
  const result = spawnSync("tar", ["-czf", archive, "-C", dirname(output), "reading-motion-kit"], { encoding: "utf8" })
  if (result.status !== 0) throw new Error(result.stderr)
  console.log(`Exported standalone kit, declarations and shadcn registry: ${output}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1 })
