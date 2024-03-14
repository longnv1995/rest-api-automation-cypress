export function credential() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Cypress.env("TOKEN")}`,
  };
}
