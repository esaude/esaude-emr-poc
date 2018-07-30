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
I'm glad you asked.
