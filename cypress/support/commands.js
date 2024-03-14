import { recurse } from "cypress-recurse";

Cypress.Commands.add("retryCreateIfFailed", (func, option = null) => {
  const defaultOptions = {
    delay: 1000,
    limit: 10,
    timeout: 120_000,
    log: true,
    error: "Failed to create a resource",
  };

  recurse(
    () => {
      return func;
    },
    res => expect(res.status).to.eq(201),
    option ?? defaultOptions,
  );
});
