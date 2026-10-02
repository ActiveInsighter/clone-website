import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3090",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] } : {},
  },
  webServer: { command: "npm run start -- --port 3090", url: "http://127.0.0.1:3090/clones", reuseExistingServer: false, timeout: 60_000 },
})
