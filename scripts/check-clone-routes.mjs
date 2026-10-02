// Verify the built application over HTTP: a successful build alone can hide 404s.
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { createServer } from "node:net"
import { fileURLToPath } from "node:url"

import { siteManifests } from "../src/sites/manifest.ts"

const root = fileURLToPath(new URL("../", import.meta.url))
const portProbe = createServer()
await new Promise((resolve, reject) => {
  portProbe.once("error", reject)
  portProbe.listen(0, "127.0.0.1", resolve)
})
const { port } = portProbe.address()
await new Promise((resolve) => portProbe.close(resolve))

const server = spawn(process.execPath, [
  fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)),
  "start", "-H", "127.0.0.1", "-p", String(port),
], { cwd: root, stdio: ["ignore", "pipe", "pipe"] })
let output = ""

try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timed out\n${output}`)), 20000)
    const fail = (error) => {
      clearTimeout(timer)
      reject(error)
    }
    server.once("error", fail)
    server.once("exit", (code) => fail(new Error(`Server exited (${code})\n${output}`)))
    const collect = (chunk) => {
      output = (output + chunk).slice(-8000)
      if (output.includes("Ready in")) {
        clearTimeout(timer)
        resolve()
      }
    }
    server.stdout.on("data", collect)
    server.stderr.on("data", collect)
  })

  const request = (path) => fetch(`http://127.0.0.1:${port}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000),
  })

  const home = await request("/")
  assert.ok([307, 308].includes(home.status))
  assert.equal(home.headers.get("location"), "/clones")
  console.log("PASS / redirects to /clones")

  const picker = await request("/clones")
  assert.equal(picker.status, 200)
  const pickerHtml = await picker.text()
  for (const site of Object.values(siteManifests)) {
    assert.ok(pickerHtml.includes(`href="${site.defaultPath}"`), `Missing picker link: ${site.id}`)
    const response = await request(site.defaultPath)
    assert.equal(response.status, 200, `${site.defaultPath} must be available in production`)
    assert.ok((await response.text()).includes(`data-clone-site="${site.id}"`), `Wrong site: ${site.id}`)
    console.log(`PASS ${site.defaultPath} serves ${site.label}`)
  }

  const unknown = await request("/clones/does-not-exist")
  assert.equal(unknown.status, 404)
  console.log("PASS unknown clone returns 404")
} finally {
  if (server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit")
    const timer = setTimeout(() => server.kill("SIGKILL"), 5000)
    server.kill("SIGTERM")
    await exited
    clearTimeout(timer)
  }
}
