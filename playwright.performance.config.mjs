import config from "./playwright.config.mjs";
import { devices } from "@playwright/test";
export default {
  ...config,
  testMatch:
    /(performance|localization|design|visual-continuity|visual-refinement|project-stage|identity|living-matter|motion-cleanup|overlays|overlay-focus|github-client|feedback|studio-transition|materia|continuity)\.spec\.mjs/,
  use: { ...config.use, baseURL: "http://localhost:3102" },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["iPad Mini"],
        defaultBrowserType: "chromium",
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        defaultBrowserType: "chromium",
        viewport: { width: 375, height: 667 },
      },
    },
  ],
  webServer: {
    command: "npm run start -- --port 3102",
    url: "http://localhost:3102",
    reuseExistingServer: true,
    timeout: 120000,
  },
};
