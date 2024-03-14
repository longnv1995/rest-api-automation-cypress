import StaticData from "../../../support/staticData";
import Utility from "../../../support/utils/utilities";

describe("Cleanup all test data", () => {
  /*
    we can create a schedule job to clean up test data at every night
    or clean up test data at the end like this.
    See order in specPattern in cypress.config.js file
  */
  let userIds;
  before(() => {
    const queryParams = {
      email: StaticData.emailPrefix,
      per_page: 100,
    };
    cy.getUsers(queryParams).then(({ status, body }) => {
      expect(status).to.eq(200);
      userIds = Utility.extractKeyFromList("id", body);
    });
  });

  // Delete all created users
  it("Delete all created users matching email pattern", () => {
    console.log(`Found ${userIds.length} users.`);
    cy.deleteBatchUsers(userIds);
  });
});
