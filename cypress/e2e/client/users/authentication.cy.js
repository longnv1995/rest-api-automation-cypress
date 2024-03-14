import UserData from "../../../support/data/userData";
import { ResponseFormat } from "../../../support/enums";
import CommonError from "../../../support/textResources/commonErrors";
import Utility from "../../../support/utils/utilities";

describe("Authentication and authorization", () => {
  let userId;

  it("[JIRA-01] Get list users should be returned", { tags: "smoke" }, () => {
    cy.getUsers().then(({ status, headers, body }) => {
      expect(status).to.eq(200);
      expect(headers["content-type"]).to.contain(ResponseFormat.JSON);
      // expect(headers['referrer-policy']).to.eq('strict-origin-when-cross-origin');
      // expect(headers['x-links-current']).to.eq("https://gorest.co.in/public/v2/users?page=1")
      // expect(headers['x-links-next']).to.eq("https://gorest.co.in/public/v2/users?page=2")
      // expect(parseInt(headers['x-pagination-limit'])).to.eq(10);
      // expect(parseInt(headers['x-pagination-page'])).to.gte(1);
      // expect(parseInt(headers['x-pagination-pages'])).to.gte(0);
      // expect(parseInt(headers['x-pagination-total'])).to.gte(0);
      // expect(parseInt(headers['x-ratelimit-limit'])).to.gte(0);
      // expect(parseInt(headers['x-ratelimit-remaining'])).to.gte(0);
      // // expect(parseInt(headers['x-ratelimit-reset'])).to.be.oneOf([0, 1]);
      expect(body.length).to.eq(10);
    });
  });

  [ Utility.randString(), `2:${Utility.randString()}`, null ].forEach(value => {
    it(`[JIRA-02] Create a user should not be saved when token is ${JSON.stringify(value)}`,  () => {
      const headers = { "Authorization": `Bearer ${value}`};
      const user = UserData.randUserData();
      cy.createUser(user, headers).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body.message).to.eq(CommonError.invalidToken);
      });
    });
  });

  [ "  ", "" ].forEach(value => {
    it(`[JIRA-03] Create a user should not be saved when token is ${JSON.stringify(value)}`, () => {
      const headers = { "Authorization": `Bearer ${value}`};
      const user = UserData.randUserData();
      cy.createUser(user, headers).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body.message).to.eq(CommonError.authenFailed);
      });
    });
  });

  it("[JIRA-04] Update a user should not be saved when token is not provided", { tags: "smoke" }, () => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      userId = body.id;
    })
      .then(() => {
        const headers = {};
        const updateUser = UserData.randUserData();
        cy.updateUser(userId, updateUser, headers).then(({ status, body }) => {
          expect(status).to.eq(404);
          expect(body.message).to.eq(CommonError.resourceNotFound);
        });
      });
  });

  it("[JIRA-05] Delete a user should not be deleted when token is not provided", { tags: "smoke" }, () => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      userId = body.id;
    })
      .then(() => {
        const headers = { "Authorization": null };
        cy.deleteUser(userId, headers).then(({ status, body }) => {
          expect(status).to.eq(404);
          expect(body.message).to.eq(CommonError.resourceNotFound);
        });
      });
  });
});
