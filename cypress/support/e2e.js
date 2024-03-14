import "./commands";
import "cypress-plugin-api";

// Import apiHelper functions
import "./apiHelpers/baseApi";
import "./apiHelpers/user";

// Import 3rd libs
import "cypress-mochawesome-reporter/register";
import "@shelex/cypress-allure-plugin";
import registerCypressGrep from "@cypress/grep/src/support";
registerCypressGrep();
// Validate json schema
import chaiJsonSchema from "chai-json-schema";
chai.use(chaiJsonSchema);