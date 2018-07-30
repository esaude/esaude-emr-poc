# POC End-To-End (E2E) Tests

This directory contains code that runs automated end-to-end tests that validate key scenarios on the POC website. Below we describe how to run these tests, why you should run these tests, and how to write new ones.

## How Do I Run E2E Tests?
1.  [Setup your development environment](https://github.com/drryanjames/esaude-emr-poc/tree/docs#setup-development-environment)
2.  `npm install`
3.  In a new terminal start selenium `npm run wd:start`
4.  `npm run e2e`
5.  Open `test/e2eTests/reports/pocE2E.html` to view test results

## Why Are E2E Tests Important?
In contrast with a unit test, an equally important type of test that validates a small chunck of code, an E2E test validates an entire scenario from beginning to end, such as: login -> find patient -> check in patient -> verify patient is checked in. These test are important because they allow us to quickly and frequently validate that key scenarios are working properly. Before these tests we would validate scenarios manually, which took several people and several months. Now we can run our entire test suite in a matter of minutes before new code is checked in. This allows us to validate changes before they're checked in, and allows us to generate reports to key stakeholders, such as the CDC and ministry of health.

## How Do I Add New E2E Tests?
I'm glad you asked. Writing new E2E tests is fairly straightforward. Before you start writing, however, I'll give you a quick explination of the framework you'll be writing upon.

### Architecture
```
--------------------
|    E2E Tests     |
--------------------
        ^
        |
--------------------
|    Puppeteer     |
--------------------
        ^
        |
--------------------
|    CodeceptJS    |
--------------------
```

#### CodeceptJS & Puppeteer
E2E tests are built on top of [CodeceptJS](https://github.com/Codeception/CodeceptJS). CodeceptJS is a wrapper around other test libraries that exposes a very simple API. From their page:

```
// A simple test that verifies that "Welcome" text is present on a main page of a site will look like:

Feature('CodeceptJS demo');

Scenario('check Welcome page on site', (I) => {
  I.amOnPage('/');
  I.see('Welcome');
});
```

As you can see, it is simple to create new test scenarios and easy to read the code that defines the test. Underneath the covers, CodeceptJS sends its commands, such as `I.amOnPage('/');`, to a separate test engine that runs the command in the browser. We are using [Puppeteer](https://github.com/GoogleChrome/puppeteer) as the underlying test engine because it is popular, comes with Chrome installed and is maintained by Google. There are several alternatives we have discussed, including [Protractor](https://www.protractortest.org/#/), that we can swap in if we so choose.

#### E2E Tests
E2E tests use CodeceptJS's APIs to run scenarios against the POC. Because each pages is unique, but many pages share elements, like the header bar, we created an extendable architecture that encapsulates test logic in an easy to use, structured form. This architecture consists of pages, components and data.

A `Page` is a class with a set of functions and properties that make it easy to interact with a page on the POC. All `Page`s are in the [pages](pages) folder.

A `Component` is a set of functions and properties that make it easy to interact with a component, like the header bar or patient search bar. All `Component`s are in the [components](pages/components) folder. 

[data.js](data.js) contains a collection of shared data, such as data about different users, patients, providers and programs, that's used across all scenarios.
