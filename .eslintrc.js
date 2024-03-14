module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:cypress/recommended",
  ],
  "overrides": [
    {
      "env": {
        "node": true,
      },
      "files": [
        ".eslintrc.{js,cjs}",
      ],
      "parserOptions": {
        "sourceType": "script",
      },
    },
  ],
  "plugins": [ "jest", "cypress" ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "rules": {
    "semi": [ "error", "always" ],
    "quotes": [ "error", "double" ],
    "no-unused-vars": 2,
    "indent": [ "error", 2 ],
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-pause": "error",
    "comma-dangle": [ "error", "always-multiline" ],
    "comma-spacing": [ "error", { "after": true } ],
    "arrow-spacing": [ "error", { "after": true } ],
    "array-bracket-spacing": [ "error", "always" ],
    "arrow-parens": [ "error", "as-needed" ],
  },
};
