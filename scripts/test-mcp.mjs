// MCP JSON-RPC harness to validate chrome-devtools-mcp end-to-end.
// Spawns the server exactly as opencode.json does, performs the MCP handshake,
// then calls: list_pages -> navigate_page(example.com) -> evaluate_script(document.title) -> take_screenshot
// Reports per-call timing and flags any timeout (the -32001 scenario).

import { spawn } from "node:child_process";

const USER_DATA_DIR = "C:/Users/22121/.chrome-devtools-mcp/chatgpt-cloner-profile";
const LOG_FILE = "C:/Users/22121/.chrome-devtools-mcp/mcp.log";

const args = [
  "-y",
  "chrome-devtools-mcp@1.6.0",
  `--user-data-dir=${USER_DATA_DIR}`,
  `--logFile=${LOG_FILE}`,
];

console.log("[harness] spawning npx", args.join(" "));
const child = spawn("npx", args, { shell: true });

let buf = "";
let id = 0;
const pending = new Map(); // id -> {resolve, reject, name, timer}

function send(req) {
  const line = JSON.stringify(req) + "\n";
  child.stdin.write(line);
}

function call(name, params, timeoutMs = 45000) {
  const reqId = ++id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(reqId);
      reject(new Error(`TIMEOUT after ${timeoutMs}ms calling ${name}`));
    }, timeoutMs);
    pending.set(reqId, { resolve, reject, name, timer });
    send({ jsonrpc: "2.0", id: reqId, method: name, params: params || {} });
  });
}

function notify(method, params) {
  send({ jsonrpc: "2.0", method, params: params || {} });
}

child.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id != null && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      clearTimeout(p.timer);
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
      else p.resolve(msg.result);
    } else if (msg.method) {
      // notification or server-initiated request; ignore for this test
    }
  }
});

let stderrText = "";
child.stderr.on("data", (chunk) => { stderrText += chunk.toString(); });

child.on("exit", (code, signal) => {
  console.log(`[harness] child exited code=${code} signal=${signal}`);
});

function fmt(s) {
  return JSON.stringify(s).slice(0, 400);
}

async function main() {
  const t0 = Date.now();
  try {
    // 1. initialize
    const t = Date.now();
    const init = await call("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "mcp-harness", version: "1.0.0" },
    }, 30000);
    console.log(`[OK] initialize (${Date.now() - t}ms): server=${init.serverInfo?.name} v${init.serverInfo?.version}`);
    notify("notifications/initialized", {});

    // 2. tools/list
    const tl = Date.now();
    const tools = await call("tools/list", {});
    const names = (tools.tools || []).map((x) => x.name);
    console.log(`[OK] tools/list (${Date.now() - tl}ms): ${names.length} tools`);
    console.log("     sample:", names.slice(0, 20).join(", "));

    const has = (n) => names.includes(n);

    // 3. list_pages (health check — the one that was timing out)
    if (has("list_pages")) {
      const tlp = Date.now();
      try {
        const r = await call("tools/call", { name: "list_pages", arguments: {} });
        console.log(`[OK] list_pages (${Date.now() - tlp}ms): ${fmt(r)}`);
      } catch (e) { console.log(`[FAIL] list_pages (${Date.now() - tlp}ms): ${e.message}`); }
    } else {
      console.log("[SKIP] list_pages not in tools");
    }

    // 4. navigate_page -> example.com
    const navName = has("navigate_page") ? "navigate_page" : (has("navigate") ? "navigate" : null);
    if (navName) {
      const tn = Date.now();
      try {
        const r = await call("tools/call", { name: navName, arguments: { url: "https://example.com/" } });
        console.log(`[OK] ${navName} (${Date.now() - tn}ms): ${fmt(r)}`);
      } catch (e) { console.log(`[FAIL] ${navName} (${Date.now() - tn}ms): ${e.message}`); }
    } else {
      console.log("[SKIP] navigate tool not found");
    }

    // 5. evaluate_script -> document.title (tool requires a `function` string arg)
    const evalName = has("evaluate_script") ? "evaluate_script" : (has("evaluate") ? "evaluate" : null);
    if (evalName) {
      const te = Date.now();
      try {
        const r = await call("tools/call", { name: evalName, arguments: { function: "() => document.title" } });
        console.log(`[OK] ${evalName} document.title (${Date.now() - te}ms): ${fmt(r)}`);
      } catch (e) { console.log(`[FAIL] ${evalName} (${Date.now() - te}ms): ${e.message}`); }
    } else {
      console.log("[SKIP] evaluate tool not found");
    }

    // 6. take_screenshot
    if (has("take_screenshot")) {
      const ts = Date.now();
      try {
        const r = await call("tools/call", { name: "take_screenshot", arguments: { format: "jpeg" } });
        // summarize content without dumping huge base64
        const content = Array.isArray(r?.content) ? r.content.map((c) => {
          if (c.type === "image") return `image/${c.mimeType||"?"} (${(c.data||"").length} bytes b64)`;
          if (c.type === "text") return `text: ${c.text.slice(0,120)}`;
          return c.type;
        }) : JSON.stringify(r).slice(0,200);
        console.log(`[OK] take_screenshot (${Date.now() - ts}ms): ${content}`);
      } catch (e) { console.log(`[FAIL] take_screenshot (${Date.now() - ts}ms): ${e.message}`); }
    } else {
      console.log("[SKIP] take_screenshot not in tools");
    }

    console.log(`\n[harness] TOTAL ${Date.now() - t0}ms — all calls above completed without -32001 timeout`);
  } catch (e) {
    console.log(`[FATAL] ${e.message}`);
    if (stderrText) console.log("[stderr]", stderrText.slice(0, 1000));
  } finally {
    child.kill();
    setTimeout(() => process.exit(0), 500);
  }
}

main();
