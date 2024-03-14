import Utility from "../utils/utilities";

export default class User {
  constructor() {
    this.name = null;
    this.email = null;
    this.gender = null;
    this.status = null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setGender(gender) {
    this.gender = gender;
    return this;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  build() {
    const user = {
      name: this.name,
      email: this.email,
      gender: this.gender,
      status: this.status,
    };
    return Utility.removeUndefined(user);
  }
}
