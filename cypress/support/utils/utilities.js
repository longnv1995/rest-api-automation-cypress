import { faker } from "@faker-js/faker";

const { _ } = Cypress;

export default class Utility {
  // Generate random data
  static randString (length = 5, isCaseSensitive = false) {
    return faker.string.alpha(
      { length: length, casing: isCaseSensitive},
    );
  }

  static randStringWithPrefix(prefix, length = 5) {
    return `${prefix}_` + Utility.randString(length);
  }

  static randSpecialChars = (length = 5) => {
    return faker.string.symbol(length);
  };

  // Usage: remove undefined filed in payload request before calling API
  // To check in case, missing a required field in payload
  static removeUndefined(obj) {
    return _.pickBy(obj, val => val !== undefined);
  }

  static errorObj = (field, msg) => {
    return {
      "field": field,
      "message": msg,
    };
  };

  // Extract a key from array of objects, eg: list users
  static extractKeyFromList(key, array) {
    return _.map(array, key);
  }
}
