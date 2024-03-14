import StaticPath from "../staticPath";
import { credential } from "../utils/credential";

const usersEndpoint = StaticPath.users;

Cypress.Commands.add("createUser", (payload, headers = credential()) => {
  cy.postRequest(usersEndpoint, payload, headers);
});

Cypress.Commands.add("createBatchUsers", users => {
  users.forEach(user => {
    cy.createUser(user).then(res => {
      expect(res.status).to.eq(201);
    });
  });
});

Cypress.Commands.add("getUser", (id, headers = credential()) => {
  cy.getRequest(`${usersEndpoint}/${id}`, headers);
});

Cypress.Commands.add("getUsers", (qs = null, headers = credential()) => {
  cy.getRequest(usersEndpoint, headers, qs);
});

Cypress.Commands.add("updateUser", (id, payload, headers = credential()) => {
  cy.patchRequest(`${usersEndpoint}/${id}`, payload, headers);
});

Cypress.Commands.add("deleteUser", (id, headers = credential()) => {
  cy.deleteRequest(`${usersEndpoint}/${id}`, headers);  
});

// Helper function to clean up test data
Cypress.Commands.add("deleteBatchUsers", (ids, headers = credential()) => {
  ids.forEach(id => {
    cy.deleteRequest(`${usersEndpoint}/${id}`, headers).then(res => {
      expect(res.status).to.eq(204);
    });  
  });
});
