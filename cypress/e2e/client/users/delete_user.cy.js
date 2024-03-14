import User from "../../../support/dataBuilders/user";
import { UserStatus } from "../../../support/enums";
import UserResKey from "../../../support/userResponseKeys";
import CommonError from "../../../support/textResources/commonErrors";
import UserData from "../../../support/data/userData";
import Utility from "../../../support/utils/utilities";

describe("/DELETE a user endpoint", () => {
  let userId;
  const { _ } = Cypress;

  Object.values(UserStatus).forEach(value => {
    it(`[JIRA-18] Delete a ${value} user should be successfully`, { tags: "smoke" }, () => {
      const user = new User()
        .setName(UserData.randName())
        .setEmail(UserData.randUniqueEmail())
        .setGender(UserData.randSex())
        .setStatus(value)
        .build();
  
      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(201);
        userId = body.id;
      })
        .then(() => {
          cy.deleteUser(userId).then(({ status, body }) => {
            expect(status).to.eq(204);
            expect(body).to.be.empty;
          });
        })
        .then(() => {
          cy.getUser(userId).then(({ status, body }) => {
            expect(status).to.eq(404);
            expect(body).to.have.all.keys(UserResKey.message);
            expect(body.message).to.eq(CommonError.resourceNotFound);
          });
        });
    });
  });

  [ _.random(1, 100), null, Utility.randString() ].forEach(userId => {
    it(`[JIRA-19] Delete a user should not be deleted when provide id is ${userId}`, () => {
      cy.getUser(userId).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body).to.have.all.keys(UserResKey.message);
        expect(body.message).to.eq(CommonError.resourceNotFound);
      });
    });
  });
});
