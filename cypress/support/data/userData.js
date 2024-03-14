const { faker } = require("@faker-js/faker");

import { Gender, UserStatus } from "../enums";
import StaticData from "../staticData";

const { _ } = Cypress;

export default class UserData {
  static randName() {
    return faker.person.fullName();
  }

  static randUniqueEmail(prefix = StaticData.emailPrefix) {
    const currentTime = Date.now();
    return `${prefix}_${currentTime}_${faker.internet.email()}`;
  }

  static randSex() {
    return _.sample(Object.values(Gender));
  }

  static randStatus() {
    return _.sample(Object.values(UserStatus));
  }

  static randUserData() {
    return {
      name: faker.person.fullName(),
      email: UserData.randUniqueEmail(),
      gender: UserData.randSex(),
      status: UserData.randStatus(),
    };
  }

  static randBatchUsers(count) {
    let users = [];
    _.times(count, function() {
      users.push(UserData.randUserData());
    });
    return users;
  }
}
