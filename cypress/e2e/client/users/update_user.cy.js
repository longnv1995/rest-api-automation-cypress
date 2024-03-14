import User from "../../../support/dataBuilders/user";
import { Gender, UserStatus } from "../../../support/enums";
import Utility from "../../../support/utils/utilities";
import UserData from "../../../support/data/userData";
import CommonError from "../../../support/textResources/commonErrors";
import UserError from "../../../support/textResources/userErrors";

const userSchema = require("../../../support/schemas/user.json");

describe("/PATCH users endpoint", () => {
  let sharedUserId;

  before(() => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      // This user is used to to verify invalid case
      sharedUserId = body.id;
    });
  });

  it("[JIRA-28] Update a user should be saved when provide valid name", { tags: "smoke" }, () => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = { name: Utility.randStringWithPrefix("update", 10) };
        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(updateUser);
          expect(body).to.be.jsonSchema(userSchema);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.deep.contain(updateUser);
              expect(body).to.be.jsonSchema(userSchema);
            });
          });
      });
  });

  it("[JIRA-29] Update a user should be saved when provide valid email", { tags: "smoke" }, () => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = { email: UserData.randUniqueEmail() };
        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(updateUser);
          expect(body).to.be.jsonSchema(userSchema);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.deep.contain(updateUser);
              expect(body).to.be.jsonSchema(userSchema);
            });
          });
      });
  });

  it("[JIRA-30] Update a user should be saved when provide valid gender", { tags: "smoke" }, () => {
    const user = new User()
      .setName(UserData.randName())
      .setEmail(UserData.randUniqueEmail())
      .setGender(Gender.MALE)
      .setStatus(UserData.randStatus())
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = { gender: Gender.FEMALE };
        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(updateUser);
          expect(body).to.be.jsonSchema(userSchema);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.deep.contain(updateUser);
              expect(body).to.be.jsonSchema(userSchema);
            });
          });
      });
  });

  it("[JIRA-31] Update a user should be saved when provide valid status", { tags: "smoke" }, () => {
    const user = new User()
      .setName(UserData.randName())
      .setEmail(UserData.randUniqueEmail())
      .setGender(UserData.randSex())
      .setStatus(UserStatus.ACTIVE)
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = { status: UserStatus.INACTIVE };
        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(updateUser);
          expect(body).to.be.jsonSchema(userSchema);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.deep.contain(updateUser);
              expect(body).to.be.jsonSchema(userSchema);
            });
          });
      });
  });

  it("[JIRA-32] Update a user should be saved when provide valid name and email", { tags: "smoke" }, () => {
    const user = UserData.randUserData();
    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = {
          name: Utility.randStringWithPrefix("update", 10),
          email: UserData.randUniqueEmail(),
        };

        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.be.jsonSchema(userSchema);
          expect(body).to.deep.contain(updateUser);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.be.jsonSchema(userSchema);
              expect(body).to.deep.contain(updateUser);
            });
          });
      });
  });

  it("[JIRA-33] Update a user should be saved when provide valid data for required fields", { tags: "smoke" }, () => {
    const user = new User()
      .setName(UserData.randName())
      .setEmail(UserData.randUniqueEmail())
      .setGender(Gender.MALE)
      .setStatus(UserStatus.INACTIVE)
      .build();

    cy.createUser(user).then(({ status, body }) => {
      expect(status).to.eq(201);
      cy.wrap(body.id);
    })
      .then(userId => {
        const updateUser = new User()
          .setName(Utility.randStringWithPrefix("update", 10))
          .setEmail(UserData.randUniqueEmail())
          .setGender(Gender.FEMALE)
          .setStatus(UserStatus.ACTIVE)
          .build();

        cy.updateUser(userId, updateUser).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.deep.contain(updateUser);
          expect(body).to.be.jsonSchema(userSchema);
        })
          .then(() => {
            cy.getUser(userId).then(({ status, body }) => {
              expect(status).to.eq(200);
              expect(body).to.deep.contain(updateUser);
              expect(body).to.be.jsonSchema(userSchema);
            });
          });
      });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-34] Create a user should not be saved when name is ${JSON.stringify(value)}`, () => {
      const updateUser = { name: value };

      cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj("name", CommonError.blankField),
        );
      });
    });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-35] Create a user should not be saved when email is ${JSON.stringify(value)}`, () => {
      const updateUser = { email: value };

      cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj("email", CommonError.blankField),
        );
      });
    });
  });

  it("[JIRA-36] Create a user should not be saved when provide invalid email", () => {
    const updateUser = { email: Utility.randStringWithPrefix("@gmail.com") };

    cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body).to.deep.contain(
        Utility.errorObj("email", UserError.invalidEmail),
      );
    });
  });

  [ null, "", " ", Utility.randSpecialChars() ].forEach(value => {
    it(`[JIRA-37] Create a user should not be saved when gender is ${JSON.stringify(value)}`, () => {
      const updateUser = { gender: value };

      cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj("gender", UserError.invalidGender),
        );
      });
    });
  });

  [ null, "", " ", Utility.randString() ].forEach(value => {
    it(`[JIRA-38] Create a user should not be saved when status is ${JSON.stringify(value)}`, () => {
      const updateUser = { status: value };

      cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj("status", CommonError.blankField),
        );
      });
    });
  });

  [ null, "", " " ].forEach(value => {
    it(`[JIRA-39] Create a user should not be saved when all fields are ${JSON.stringify(value)}`, () => {
      const updateUser = new User()
        .setName(value)
        .setEmail(value)
        .setGender(value)
        .setStatus(value)
        .build();

      cy.updateUser(sharedUserId, updateUser).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body).to.deep.contain(
          Utility.errorObj("name", CommonError.blankField),
        );
        expect(body).to.deep.contain(
          Utility.errorObj("email", CommonError.blankField),
        );
        expect(body).to.deep.contain(
          Utility.errorObj("gender", UserError.invalidGender),
        );
        expect(body).to.deep.contain(
          Utility.errorObj("status", CommonError.blankField),
        );
      });
    });
  });
});
