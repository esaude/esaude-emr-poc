# POC End-To-End Tests

In order to validate the POC website is working properly someone needs to open the site, click through pages, fill out forms, and see that everything is working properly. These are commonly known as End-To-End (E2E) testing. When we did this manually it took us several months. This directory defines a framework that automates our E2E tests in a few minutes, which allows us to validate the POC is working much more frequently. Below we describe how to run these tests, how to write them, their underlying architecture, and why we think they're important.

## How Do I Run E2E Tests?
1.  [Setup your development environment](https://github.com/drryanjames/esaude-emr-poc/tree/docs#setup-development-environment)
2.  In the root directory run `npm install`
3.  In a new terminal start selenium `npm run wd:start`
4.  In a separate terminal run E2E tests `npm run e2e`
5.  Once the tests have finished open `test/e2eTests/reports/pocE2E.html` to view results

## How Do I Write E2E Tests?
Adding a new E2E test? If you haven't done so already, I recommend reading the next section on architecture before reading this section. I'm inpatient, however, and just want to see code, so I placed this section earlier in the stack.

```javascript
Feature('Login');

Scenario('Login successful with admin credentials and logout', (I, LoginPage, Data) => {
	// Log the user in
	const loginStatus = LoginPage.login(Data.users.admin);
	
	// Validate that login was successful
	const dashboardPage = loginStatus.successful();
	
	// Log the user out
	const logoutStatus = dashboardPage.logout();
	
	// Validate that logout was successful
	logoutStatus.successful();
});
```
The above is a snippet from [login_test.js](tests/login_test.js) which verifies a user can login to the POC. Let's break it down line-by-line.

<br />

```javascript
Feature('Login');
```
Groups all scenarios defined in the file under a single feature. This does more for organization than anything else.

<br />

```javascript
Scenario('Login successful with admin credentials and logout', (I, LoginPage, Data) => {
  // ...
});
```
Defines a new scenario with a description and a delegate containing the scenario's logic. `I`, `LoginPage` and `Data` are special variables that, when defines, are automatically imported into the delegate function.

<br />

```javascript
	// Log the user in
	const loginStatus = LoginPage.login(Data.users.admin);
```
Logs in with admin credentials using the login page form. [pages/loginPage.js](pages/loginPage.js) defines the `login(userInfo)` function. [data.js](data.js) defines data about the admin user, including their username and password.

<br />

```javascript
	// Validate that login was successful
	const dashboardPage = loginStatus.successful();
```
Validates the login was successful. After a successful login the POC automatically takes the user to the dashboard page.

<br />

```javascript
	// Log the user out
	const logoutStatus = dashboardPage.logout();
```
Selects the logout button in the POC header bar.

<br />

```javascript
	// Validate that logout was successful
	logoutStatus.successful();
```
Validates that logout was successful.

<br />

That's it! Ready to write your own? There are a bunch of examples in the [tests](tests) folder. When writing tests please keep in mind:
- `I`, `Apis`, `Data` and all `*Page`s are special variables that can be imported into delegates
- `Before` and `After` run logic before and after each test
- `BeforeSuite` and `AfterSuite` run login before and after all scenarios defined in a single file
- `Apis` should be used to setup the database for your test. All data created with `Apis` is cleaned up automatically after each test.

## E2E Test Architecture
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

## Why Are E2E Tests Important?
In contrast with a unit test, an equally important type of test that validates a small chunck of code, an E2E test validates an entire scenario from beginning to end, such as: login -> find patient -> check in patient -> verify patient is checked in. These test are important because they allow us to quickly and frequently validate that key scenarios are working properly. Before these tests we would validate scenarios manually, which took several people and several months. Now we can run our entire test suite in a matter of minutes before new code is checked in. This allows us to validate changes before they're checked in, and allows us to generate reports to key stakeholders, such as the CDC and ministry of health.
