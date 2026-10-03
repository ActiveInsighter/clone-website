import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises"
import { dirname, isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const project = fileURLToPath(new URL("../", import.meta.url))
const marker = ".evidence-export.json"
const uiFiles = ["table.tsx", "card.tsx", "button.tsx", "tabs.tsx", "chart.tsx", "collapsible.tsx"]

function relativeImports(source, sourceFile) {
  return source.replace(/(["'])@\/([^"']+)\1/g, (_match, quote, target) => {
    let path = relative(dirname(sourceFile), join(project, "src", target)).replaceAll("\\", "/")
    if (!path.startsWith(".")) path = `./${path}`
    return `${quote}${path}${quote}`
  })
}

async function copySource(path, destination) {
  const sourceFile = join(project, "src", path)
  const output = join(destination, "src", path)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, relativeImports(await readFile(sourceFile, "utf8"), sourceFile))
}

/** Produce a standalone, unbranded source package with compiled JS and declarations. */
export async function exportEvidence(destination) {
  const output = resolve(destination)
  if (output === project || project.startsWith(`${output}/`) || output.startsWith(join(project, "src") + "/") || output === join(project, "src")) {
    throw new Error("Export destination must be separate from the application source.")
  }
  await mkdir(output, { recursive: true })
  const existing = await readdir(output)
  if (existing.length && !existing.includes(marker)) {
    throw new Error("Destination contains unrelated files. Choose an empty directory.")
  }
  await writeFile(join(output, marker), JSON.stringify({ version: 1 }) + "\n")
  const files = await readdir(join(project, "src/components/evidence"))
  for (const file of files.filter(file => /\.(ts|tsx|css)$/.test(file))) {
    await copySource(`components/evidence/${file}`, output)
  }
  for (const file of uiFiles) await copySource(`components/ui/${file}`, output)
  await copySource("lib/utils.ts", output)
  await writeFile(join(output, "src/index.ts"), 'export * from "./components/evidence"\n')

  // Keep only the neutral shadcn foundation; omit every existing site's tokens.
  const globals = (await readFile(join(project, "src/app/globals.css"), "utf8"))
    .split("@layer base")[0]
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n").filter(line => !line.includes("--studio-") && !line.includes("--sidebar-")).join("\n")
  await copyFile(join(project, "node_modules/shadcn/dist/tailwind.css"), join(output, "src/shadcn-variants.css"))
  await copyFile(join(project, "node_modules/shadcn/LICENSE.md"), join(output, "SHADCN_LICENSE.md"))
  const styles = globals.replace('@import "shadcn/tailwind.css";', '@import "./shadcn-variants.css";\n@import "./components/evidence/evidence-theme.css";')
  await writeFile(join(output, "src/styles.css"), `${styles}\n@source "./components";\n`)
  const rootPackage = JSON.parse(await readFile(join(project, "package.json"), "utf8"))
  const dependencies = Object.fromEntries(["@base-ui/react", "class-variance-authority", "clsx", "lucide-react", "recharts", "tailwind-merge"].map(name => [name, rootPackage.dependencies[name]]))
  const packageJson = {
    name: "@clone-lab/evidence", version: "0.1.0", private: true, type: "module",
    license: rootPackage.license,
    description: "Reusable shadcn evidence tables, charts and editorial components",
    scripts: { build: "node build.mjs" },
    sideEffects: ["**/*.css"],
    exports: { ".": { types: "./lib/index.d.ts", import: "./lib/index.js" }, "./styles.css": "./src/styles.css", "./theme.css": "./src/components/evidence/evidence-theme.css" },
    files: ["src", "lib", "build.mjs", "tsconfig.json", "README.md", "LICENSE", "SHADCN_LICENSE.md"],
    peerDependencies: { react: "^19.0.0", "react-dom": "^19.0.0", tailwindcss: "^4", "tw-animate-css": rootPackage.dependencies["tw-animate-css"] }, dependencies,
    devDependencies: { typescript: rootPackage.devDependencies.typescript, "@types/react": rootPackage.devDependencies["@types/react"], "@types/react-dom": rootPackage.devDependencies["@types/react-dom"] },
  }
  await writeFile(join(output, "package.json"), JSON.stringify(packageJson, null, 2) + "\n")
  await copyFile(join(project, "LICENSE"), join(output, "LICENSE"))
  await writeFile(join(output, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["ES2020", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: true, esModuleInterop: true, declaration: true, outDir: "lib", rootDir: "src" }, include: ["src/**/*.ts", "src/**/*.tsx"] }, null, 2) + "\n")
  await writeFile(join(output, "build.mjs"), `import { copyFile, mkdir, readdir } from "node:fs/promises"\nimport { createRequire } from "node:module"\nimport { dirname, join } from "node:path"\nimport { fileURLToPath } from "node:url"\nimport { spawnSync } from "node:child_process"\nconst root = dirname(fileURLToPath(import.meta.url))\nconst require = createRequire(import.meta.url)\nconst result = spawnSync(process.execPath, [require.resolve("typescript/bin/tsc"), "-p", join(root, "tsconfig.json")], { stdio: "inherit" })\nif (result.status !== 0) process.exit(result.status || 1)\nfor (const file of await readdir(join(root, "src/components/evidence"))) {\n  if (!file.endsWith(".css")) continue\n  await mkdir(join(root, "lib/components/evidence"), { recursive: true })\n  await copyFile(join(root, "src/components/evidence", file), join(root, "lib/components/evidence", file))\n}\n`)

  const compiled = spawnSync(process.execPath, [join(project, "node_modules/typescript/bin/tsc"), "-p", join(output, "tsconfig.json")], { encoding: "utf8" })
  if (compiled.status !== 0) throw new Error(`Portable package compilation failed:\n${compiled.stdout}${compiled.stderr}`)
  for (const file of files.filter(file => file.endsWith(".css"))) {
    const path = `components/evidence/${file}`
    await mkdir(dirname(join(output, "lib", path)), { recursive: true })
    await writeFile(join(output, "lib", path), await readFile(join(output, "src", path)))
  }
  const guide = await readFile(join(project, "docs/components/evidence.md"), "utf8")
  await writeFile(join(output, "README.md"), `# Evidence — portable component kit\n\nThis archive contains editable source, compiled ESM and TypeScript declarations. No Next.js routes, site content, fonts or branded images are included.\n\n## Integrate\n\nCopy the folders under src into your React project, or install this folder as a local package with npm. This kit uses React 19, Tailwind 4 and shadcn Base UI. Install its declared dependencies. If using it as a package, add its src directory to your Tailwind @source scan.\n\nFor a new project, import @clone-lab/evidence/styles.css once. In an existing shadcn project, retain your existing global CSS and import @clone-lab/evidence/theme.css once instead. Wrap consumers in data-evidence-theme=\"paper\" or \"dark\".\n\n\x60\x60\x60tsx\nimport { BenchmarkTable, CostPerformanceChart } from "@clone-lab/evidence"\nimport "@clone-lab/evidence/theme.css"\n\x60\x60\x60\n\nThese components require your Tailwind/shadcn foundation; they are not standalone precompiled CSS widgets. The archive has already compiled successfully with strict TypeScript.\n\n${guide}\n`)
  await writeFile(join(output, marker), JSON.stringify({ version: 1, files: files.length + uiFiles.length + 1 }) + "\n")
  return output
}

async function main() {
  const args = process.argv.slice(2)
  const output = await exportEvidence(args[0] ? (isAbsolute(args[0]) ? args[0] : resolve(args[0])) : join(project, "dist/evidence-kit"))
  const archive = `${output}.tar.gz`
  const result = spawnSync("tar", ["-czf", archive, "-C", dirname(output), relative(dirname(output), output)], { encoding: "utf8" })
  if (result.status !== 0) throw new Error(`Archive creation failed: ${result.stderr}`)
  await mkdir(join(project, "public/downloads"), { recursive: true })
  await copyFile(archive, join(project, "public/downloads/evidence-kit.tar.gz"))
  console.log(`Exported source and compiled components: ${output}`)
  console.log(`Portable archive: ${archive} (${(await stat(archive)).size} bytes)`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
