## Rest API automation testing using cypress
I'm using API from this site: https://gorest.co.in/

Following this guide to setup and run API tests

## Setup
Install Node on your machine. Check node version in .nvmrc file
Next step,
```bash
git clone https://github.com/longnv1995/rest-api-automation-cypress.git
cd rest-api-automation-cypress
cp .env.example .env
```
Then,
Login https://gorest.co.in/ and generate a token as lifetime
Replace token in .env file with generated token in pre-con step

Finally, install all dependencies
```bash
npm i
```

## How to run E2E tests locally
1. To run all tests in production environment
```bash
npm run cy:run:prod
```
2. To run tests in browser (UI)
```bash
npm run cy:open:prod
```

See other commands in package.json file

## Note
Currently, we're assumming that, dev and staging envs are available
That's the reason why I created two files, development.config.js and staging.config.js

## Features
- Run test in parallel
- Run smoke test/regression test
- Run on different environments such as dev, staging, prod
- Setup and run tests with CI/CD pipeline
- Integrate with Cypress cloud
- More...
## Result
![image](https://github.com/longnv1995/rest-api-automation-cypress/assets/84616832/4a9a76b1-d04e-41dd-a70e-c984d5925aba)
