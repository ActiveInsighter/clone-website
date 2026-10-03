// Resolve aliases and relative imports with TypeScript, including re-exports and import().
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = fileURLToPath(new URL("../", import.meta.url))
const configPath = join(root, "tsconfig.json")
const config = ts.readConfigFile(configPath, ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const siteOwner = path => /^src\/sites\/([^/]+)\//.exec(path)?.[1]
const violations = []
const files = (await readdir(join(root, "src"), { recursive: true })).filter(file => /\.(ts|tsx)$/.test(file))
for (const file of files) {
  const path = join(root, "src", file)
  const sourcePath = relative(root, path)
  const owner = siteOwner(sourcePath)
  const isShared = /^(components|hooks|lib|types)\//.test(file) && file !== "components/clone-picker.tsx"
  const source = ts.createSourceFile(path, await readFile(path, "utf8"), ts.ScriptTarget.Latest, true)
  function visit(node) {
    const specifier = ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
      ? node.moduleSpecifier
      : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : undefined
    if (specifier && ts.isStringLiteral(specifier)) {
      const resolved = ts.resolveModuleName(specifier.text, path, options, ts.sys).resolvedModule
      if (resolved) {
        const target = relative(root, resolved.resolvedFileName)
        const targetOwner = siteOwner(target)
        if (targetOwner && ((owner && owner !== targetOwner) || isShared)) {
          violations.push(`${sourcePath} imports private ${targetOwner} code: ${specifier.text}`)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}
assert.deepEqual(violations, [], `Site boundaries violated:\n${violations.join("\n")}`)
console.log(`PASS site ownership and shared-component boundaries (${files.length} source files)`)
