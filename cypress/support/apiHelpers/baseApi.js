// Create a resource
Cypress.Commands.add("postRequest", (url, payload, headers, timeout = null) => {
  cy.api({
    method: "POST",
    url: url,
    body: payload,
    headers: headers,
    failOnStatusCode: false,
    timeout: timeout ?? Cypress.config("responseTimeout"),
  });
});

// Get a resource
Cypress.Commands.add("getRequest", (url, headers, qs = null, timeout = null) => {
  cy.api({
    method: "GET",
    url: url,
    headers: headers,
    qs: qs,
    failOnStatusCode: false,
    timeout: timeout ?? Cypress.config("responseTimeout"),
  });
});

// Update a resource
Cypress.Commands.add("patchRequest", (url, payload, headers, timeout = null) => {
  cy.api({
    method: "PATCH",
    url: url,
    headers: headers,
    body: payload,
    failOnStatusCode: false,
    timeout: timeout ?? Cypress.config("responseTimeout"),
  });
});

// Delete a resource
Cypress.Commands.add("deleteRequest", (url, headers, timeout = null) => {
  cy.api({
    method: "DELETE",
    url: url,
    headers: headers,
    failOnStatusCode: false,
    timeout: timeout ?? Cypress.config("responseTimeout"),
  });
});
