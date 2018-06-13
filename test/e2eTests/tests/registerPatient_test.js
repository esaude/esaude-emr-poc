const assert = require('assert');

// Test for:
// https://docs.google.com/document/d/123Dmfh0gn8gZdiZmN91PKTf8-4K06ZEdtT-Xg4_pz2c/edit#

Feature('Register Patient');

const LOG_TAG = '[RegisterPatientTests]';

Before(async (I, Apis, Data) => {
  I.say(`${LOG_TAG} Starting Patient Registration Tests`);
});


Scenario('Validate tab sequence', (I, RegistrationDashboardPage) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  registrationPage.clickNewPatienButton();

  I.say(`${LOG_TAG} Make sure the new patient page is loaded`);
  RegistrationDashboardPage.verifyNewPatientPage();

  const tabSequenseMessage = RegistrationDashboardPage.translate('FOLLOW_SEQUENCE_OF_TABS');

  I.say(`${LOG_TAG} Validating tab sequence`);

  I.click(RegistrationDashboardPage.tabs.name)
  I.see(RegistrationDashboardPage.translate('ERROR_REQUIRED'));

  I.click(RegistrationDashboardPage.tabs.gender);
  I.see(tabSequenseMessage);

  I.click(RegistrationDashboardPage.tabs.age);
  I.see(tabSequenseMessage);

  I.click(RegistrationDashboardPage.tabs.address);
  I.see(tabSequenseMessage);

  I.click(RegistrationDashboardPage.tabs.contacts);
  I.see(tabSequenseMessage);

  I.click(RegistrationDashboardPage.tabs.testing)
  I.see(tabSequenseMessage);
})
