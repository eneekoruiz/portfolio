import config from "./playwright.config.mjs";
export default {
  ...config,
  testMatch: /(performance|localization)\.spec\.mjs/,
  use: { ...config.use, baseURL: "http://localhost:3102" },
  webServer: {
    command: "npm run start -- --port 3102",
    url: "http://localhost:3102",
    reuseExistingServer: true,
    timeout: 120000,
  },
};
