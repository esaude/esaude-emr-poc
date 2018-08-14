# POC End-To-End Tests

###### [APIs](DOCS.md)

![e2e login tests](https://user-images.githubusercontent.com/2764891/43496135-82e842c4-94f0-11e8-8e99-139c8cfcecbc.gif)

In order to validate the POC website is working properly someone needs to open the site, click through pages, fill out forms, and see that everything is working properly. This is commonly known as End-To-End (E2E) testing. When done manually it can take several months and several people to test thoroughly, fix issues and retest. This directory defines a framework that automates E2E testing. Running these tests takes only a few minutes, which allows us to validate the POC is working much more frequently. Below we describe how to run these tests, how to write them, and their underlying architecture.

## How Do I Run E2E Tests?
1.  [Setup your development environment](https://github.com/drryanjames/esaude-emr-poc/tree/docs#setup-development-environment)
2.  In the root directory run `npm install`
3.  In a new terminal start selenium `npm run wd:start`
4.  In a separate terminal run E2E tests `npm run e2e`
5.  Once the tests have finished open `test/e2eTests/reports/pocE2E.html` to view results

## How Do I Write E2E Tests?
Adding a new E2E test? If you haven't done so already, I recommend reading the next section on architecture before reading this one. I'm inpatient, however, and just want to see code, so I placed this section earlier in the stack.

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
This line groups all scenarios under a single feature. This does more for organization than anything else.

<br />

```javascript
Scenario('Login successful with admin credentials and logout', (I, LoginPage, Data) => {
```
Defines a new scenario with a description and a delegate containing the scenario's logic. `I`, `LoginPage` and `Data` are special variables that are automatically imported into the delegate function.

<br />

```javascript
	// Log the user in
	const loginStatus = LoginPage.login(Data.users.admin);
```
Logs in with admin credentials using the login page form. [pages/loginPage.js](pages/loginPage.js) defines `LoginPage.login(...)`. [data.js](data.js) defines `Data` which defines information about the admin user, including their username and password.

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
});
```
Validates the logout was successful.

<br />

That's it! Ready to write your own? There are a bunch of examples in the [tests](tests) folder. When writing tests please keep in mind:
- Every page in the POC has an associated test page defined in [pages](pages). More on this in the [next](https://github.com/drryanjames/esaude-emr-poc/tree/docs/test/e2eTests#e2e-test-architecture) section.
- `I`, `Apis`, `Data` and all `*Page`s are special variables that can be imported into delegates
- `Before` and `After` run logic before and after each test
- `BeforeSuite` and `AfterSuite` run login before and after all scenarios defined in a single file
- `Apis` should be used to setup the database for your test. All data created with `Apis` is cleaned up automatically after each test.

## E2E Test Architecture
![image](https://user-images.githubusercontent.com/2764891/44108066-1e003470-9fae-11e8-897c-80ec956d153c.png)

### CodeceptJS & Puppeteer
E2E tests are built on top of [CodeceptJS](https://github.com/Codeception/CodeceptJS). CodeceptJS is a wrapper around other test libraries and exposes a very simple API. From their page:

```
// A simple test that verifies that "Welcome" text is present on a main page of a site will look like:

Feature('CodeceptJS demo');

Scenario('check Welcome page on site', (I) => {
  I.amOnPage('/');
  I.see('Welcome');
});
```

As you can see its simple to create new test scenarios and easy to read the code that defines them. Underneath the covers, CodeceptJS sends its commands, such as `I.amOnPage('/');`, to a separate test engine that runs the command in the browser. We are using [Puppeteer](https://github.com/GoogleChrome/puppeteer) as the underlying test engine because its powerful, popular, comes with Chrome installed and is maintained by Google. There are several alternatives we have discussed, including [Protractor](https://www.protractortest.org/#/), that we can swap in if we so choose.

### E2E Tests
E2E tests use CodeceptJS's APIs to run scenarios against the POC. Each page on the POC is unique but can have the same elements, like the header bar for example. To make tests easy to read and write E2E tests consists of pages, components and data.

A `Page` is a class with a set of functions and properties that make it easy to interact with a page on the POC. All `Page`s are in the [pages](pages) folder.

A `Component` is a set of functions and properties that make it easy to interact with elements that are found on multiple pages, like the header bar or patient search bar. All `Component`s are in the [components](pages/components) folder. 

[data.js](data.js) contains a collection of shared data, such as data about different users, patients, providers and programs that are used across all scenarios. If you use data in more than one test file you may want to add it to [data.js](data.js). Data is injected into OpenMRS using APIs to setup tests before they run and clean up after tests are finished. 
