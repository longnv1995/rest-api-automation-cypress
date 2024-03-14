import { UserStatus, Gender } from "../../../support/enums";
import Utility from "../../../support/utils/utilities";
import UserData from "../../../support/data/userData";

const userSchema = require("../../../support/schemas/user.json");

describe("/GET filter users endpoint", () => {
  const { _ } = Cypress;
  const totalUsers = 10;

  before(() => {
    const users = UserData.randBatchUsers(totalUsers);
    cy.createBatchUsers(users);
  });

  it("[JIRA-20] Get list users should be returned", { tags: "smoke" }, () => {
    cy.getUsers().then(({ status, body, headers }) => {
      expect(status).to.eq(200);
      expect(headers["content-type"]).to.contain("application/json");
      expect(headers["referrer-policy"]).to.eq("strict-origin-when-cross-origin");
      expect(body).to.have.lengthOf(10);
      _.each(body, item => {
        expect(item).to.be.jsonSchema(userSchema);
      });
    });
  });

  Object.values(UserStatus).forEach(value => {
    it(`[JIRA-21] Filter users by status '${value}' should be returned`, { tags: "smoke" }, () => {
      const queryParams = { status: value };
      cy.getUsers(queryParams).then(({ status, body }) => {
        expect(status).to.eq(200);
        _.each(body, item => {
          expect(item.status).to.eq(value);
          expect(item).to.be.jsonSchema(userSchema);
        });
      });
    });
  });

  Object.values(Gender).forEach(value => {
    it(`[JIRA-22] Filter users by gender '${value}' should be returned`, { tags: "smoke" }, () => {
      cy.getUsers({ status: value }).then(({ status, body }) => {
        expect(status).to.eq(200);
        _.each(body, item => {
          expect(item.status).to.eq(value);
          expect(item).to.be.jsonSchema(userSchema);
        });
      });
    });
  });

  [
    { gender: Gender.MALE, userStatus: UserStatus.ACTIVE},
    { gender: Gender.FEMALE, userStatus: UserStatus.INACTIVE },
  ].map(({ gender, userStatus }) => {
    it(`[JIRA-23] Filter users by gender '${gender}' and status '${userStatus}' should be returned`, { tags: "smoke" }, () => {
      const queryParams = {
        gender: gender,
        status: userStatus,
      };
      cy.getUsers(queryParams).then(({ status, body }) => {
        expect(status).to.eq(200);
        _.each(body, item => {
          expect(item.status).to.eq(userStatus);
          expect(item.gender).to.eq(gender);
          expect(item).to.be.jsonSchema(userSchema);
        });
      });
    });
  });

  [ _.random(10, 20), Utility.randSpecialChars(10) ].forEach(value => {
    it(`[JIRA-24] Filter users by gender is '${value}' should be empty`, () => {
      const queryParams = {
        gender: value,
      };
      cy.getUsers(queryParams).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.lengthOf(0);
      });
    });
  });

  [
    { gender: Utility.randString(), userStatus: UserStatus.ACTIVE },
    { gender: Gender.FEMALE, userStatus: Utility.randString() },
    { gender: Utility.randString(), userStatus: Utility.randSpecialChars() },
  ].map(({ gender, userStatus }) => {
    it(`[JIRA-25] Filter users by gender '${gender}' and status '${userStatus}' should be empty`, () => {
      const queryParams = {
        gender: gender,
        status: userStatus,
      };
      cy.getUsers(queryParams).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.lengthOf(0);
      });
    });
  });
});
