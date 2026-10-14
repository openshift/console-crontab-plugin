const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Console uses this user agent to suppress the asynchronous Welcome tour.
  userAgent: "ConsoleIntegrationTestEnvironment",
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotsFolder: "./artifacts/screenshots",
  videosFolder: "./artifacts/videos",
  video: true,
  reporter: "../../node_modules/cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  fixturesFolder: "fixtures",
  defaultCommandTimeout: 30000,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require("./plugins/index.ts")(on, config);
    },
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "support/index.ts",
    testIsolation: false,
  },
});
