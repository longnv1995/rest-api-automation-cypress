const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    // eslint-disable-next-line no-unused-vars
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      require("@cypress/grep/src/plugin")(config);
      // Run tests on specific env, by default is development
      const configFile = config.env.configFile || "development";
      const envFile = `./cypress/config/${configFile}.json`;
      const settings = require(envFile);

      if (settings.baseUrl) {
        config.baseUrl = settings.baseUrl;
      }
      // Read all values from .env file and assign it to config.env
      config.env = process.env;
      // Merge config and settings into one
      if (settings.env) {
        config.env = {
          ...config.env,
          ...settings.env,
        };
      }
      return config;
    },
    specPattern: [
      "cypress/e2e/client/users/*.cy.js",
      "cypress/e2e/client/cleanup/*.cy.js",
    ],
  },
  // retries: {
  //   openMode: 1,
  //   runMode: 1,
  // },
  video: false,
  screenshotOnRunFailure: true,
  requestTimeout: 60000,
  responseTimeout: 60000,
});
