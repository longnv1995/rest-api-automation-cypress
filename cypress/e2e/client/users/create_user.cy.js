import { faker } from "@faker-js/faker";

import UserData from "../../../support/data/userData";
import UserResKey from "../../../support/userResponseKeys";
import User from "../../../support/dataBuilders/user";
import { Gender, UserStatus } from "../../../support/enums";
import UserError from "../../../support/textResources/userErrors";
import CommonError from "../../../support/textResources/commonErrors";
import Utility from "../../../support/utils/utilities";

const userSchema = require("../../../support/schemas/user.json");

describe("/POST users endpoint", () => {
  let userId;

  [
    { gender: Gender.MALE, userStatus: UserStatus.ACTIVE },
    { gender: Gender.FEMALE, userStatus: UserStatus.INACTIVE },
  ].map(({ gender, userStatus }) => {
    it(`[JIRA-06] Create a user should be saved when gender "${gender}" and status "${userStatus}" are provided`, { tags: "smoke" }, () => {
      const user = new User().setName(faker.person.fullName())
        .setEmail(UserData.randUniqueEmail())
        .setGender(gender)
        .setStatus(userStatus)
        .build();

      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body).to.deep.contain(user);
        expect(body).to.be.jsonSchema(userSchema);
        userId = body.id;
      })
        .then(() => {
          cy.getUser(userId).then(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body).to.deep.contain(user);
            expect(body).to.be.jsonSchema(userSchema);
          });
        });
    });
  });
  
  it("[JIRA-07] Create a user should be saved when all fields are provided with random data", { tags: "smoke" }, () => {
    const user = UserData.randUserData();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body).to.deep.contain(user);
      userId = body.id;
    })
      .then(() => {
        cy.getUser(userId).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(user);
        });
      });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-08] Create a user should not be saved when name is ${JSON.stringify(value)}`, () => {
      const user = new User()
        .setName(null)
        .setEmail(UserData.randUniqueEmail())
        .setGender(Gender.MALE)
        .setStatus(UserStatus.ACTIVE)
        .build();
  
      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj(UserResKey.name, CommonError.blankField),
        );
      });
    });
  });

  it("[JIRA-09] Create a user should not be saved when no name field", { tags: "smoke" }, () => {
    const user = new User()
      .setName(undefined)
      .setEmail(UserData.randUniqueEmail())
      .setGender(UserData.randSex())
      .setStatus(UserData.randStatus())
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body).to.deep.contain(
        Utility.errorObj(UserResKey.name, CommonError.blankField),
      );
    });
  });

  it("[JIRA-10] Create a user should not be saved when email is already existed", { tags: "smoke" }, () => {
    const user = UserData.randUserData();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.email).to.eq(user.email);
    })
      .then(() => {
        cy.createUser(user).then(({ status, body }) => {
          expect(status).to.eq(422);
          expect(body).to.deep.contain(
            Utility.errorObj(UserResKey.email, UserError.existedEmail),
          );
        });
      });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-11] Create a user should not be saved when email is ${JSON.stringify(value)}`, () => {
      const user = new User()
        .setName(faker.person.fullName())
        .setEmail(value)
        .setGender(Gender.MALE)
        .setStatus(UserStatus.ACTIVE)
        .build();
  
      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj(UserResKey.email, CommonError.blankField),
        );
      });
    });
  });

  [ Utility.randString(), "@gmail.com" ].forEach(value => {
    it(`[JIRA-12] Create a user should not be saved when email is ${JSON.stringify(value)}`, () => {
      const user = new User()
        .setName(faker.person.fullName())
        .setEmail(value)
        .setGender(Gender.MALE)
        .setStatus(UserStatus.ACTIVE)
        .build();
  
      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj(UserResKey.email, UserError.invalidEmail),
        );
      });
    });
  });

  it("[JIRA-13] Create a user should not be saved when no email field", { tags: "smoke" }, () => {
    const user = new User()
      .setName(faker.person.fullName())
      .setEmail(undefined)
      .setGender(Gender.MALE)
      .setStatus(UserStatus.ACTIVE)
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body).to.deep.contain(
        Utility.errorObj(UserResKey.email, CommonError.blankField),
      );
    });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-14] Create a user should not be saved when gender is ${JSON.stringify(value)}`, () => {
      const user = new User()
        .setName(faker.person.fullName())
        .setEmail(UserData.randUniqueEmail())
        .setGender(null)
        .setStatus(UserStatus.ACTIVE)
        .build();
  
      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj(UserResKey.gender, UserError.invalidGender),
        );
      });
    });
  });

  it("[JIRA-15] Create a user should not be saved when no gender field", { tags: "smoke" }, () => {
    const user = new User()
      .setName(faker.person.fullName())
      .setEmail(UserData.randUniqueEmail())
      .setGender(undefined)
      .setStatus(UserStatus.ACTIVE)
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body).to.deep.contain(
        Utility.errorObj(UserResKey.gender, UserError.invalidGender),
      );
    });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-16] Create a user should not be saved when gender is ${JSON.stringify(value)}`, () => {
      const user = new User()
        .setName(faker.person.fullName())
        .setEmail(UserData.randUniqueEmail())
        .setGender(Gender.MALE)
        .setStatus(null)
        .build();

      cy.createUser(user).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj(UserResKey.status, CommonError.blankField),
        );
      });
    });
  });

  it("[JIRA-17] Create a user should not be saved when no status field", { tags: "smoke" }, () => {
    const user = new User()
      .setName(faker.person.fullName())
      .setEmail(UserData.randUniqueEmail())
      .setGender(Gender.MALE)
      .setStatus(undefined)
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body).to.deep.contain(
        Utility.errorObj(UserResKey.status, CommonError.blankField),
      );
    });
  });
});
