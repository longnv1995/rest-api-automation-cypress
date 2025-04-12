import CommonError from "../../../support/textResources/commonErrors";
import { randUserData } from "../../../support/data/userData";
import UserResKey from "../../../support/userResponseKeys";

describe("/GET users endpoint", () => {
  let userId;
  const { _ } = Cypress;

  it("[JIRA-26] Get a user should be returned when provide valid user id", { tags: "smoke" }, () => {
    const user = randUserData();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      userId = body.id;
    })
      .then(() => {
        cy.getUser(userId).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(user);
          // we already verify schema in create_user spec file (GET user after creating successfully)
        });
      });
  });

  [ _.random(1, 100), null, "abcdef", "@#!@##@?$" ].forEach(userId => {
    it(`[JIRA-27] Get a user should not returned when user id is ${userId}`, () => {
      cy.getUser(userId).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body).to.have.all.keys(UserResKey.message);
        expect(body.message).to.eq(CommonError.resourceNotFound);
        // expect(body.message).to.eq(CommonError.resourceNotFound);
      });
    });
  });
});
