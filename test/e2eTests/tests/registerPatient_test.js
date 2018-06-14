const assert = require('assert');

// Test for:
// https://docs.google.com/document/d/123Dmfh0gn8gZdiZmN91PKTf8-4K06ZEdtT-Xg4_pz2c/edit#

Feature('Register Patient');

const LOG_TAG = '[RegisterPatientTests]';

Before(async (I, Apis, Data) => {
  I.say(`${LOG_TAG} Starting Patient Registration Tests`);
});

After(async (I, Apis, Data) => {
  // Removes patients created through the UI
  const cleanUpPatient = async (patient) => {
    I.say(`${LOG_TAG} Deleting patient created through the UI`);

    const identifier = patient.identifiers[0].identifier3;
    I.say(`${LOG_TAG} Getting the patient with identifier ${identifier}`);
    const patients = await Apis.patient.getAll({ identifier: identifier });

    I.say(`${LOG_TAG} Deleting patients with identifier ${identifier}`);
    if (patients.length) {
      patients.forEach(async v => await Apis.patient.delete(v));
    }
  };

  await cleanUpPatient(Data.patients.patient3);
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

Scenario('Register a patient', (I, Data, RegistrationDashboardPage) => {
  const patient = Data.patients.patient3;
  const nextStepButton = RegistrationDashboardPage.buttons.nextStep;
  const fields = RegistrationDashboardPage.fields;

  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  registrationPage.clickNewPatienButton();

  I.say(`${LOG_TAG} Make sure the new patient page is loaded`);
  RegistrationDashboardPage.verifyNewPatientPage();

  validateRequiredFields(I, RegistrationDashboardPage, 'Identifier', 1);
  I.say(`${LOG_TAG} Fill in the NID identifier and move to Name tab`);
  I.fillField(fields.nid, patient.identifiers[0].identifier3);
  I.waitForInvisible('#overlay', 5);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegistrationDashboardPage, 'Names', 2);
  I.say(`${LOG_TAG} Fill in givenName and familyName and move to Gender tab`);
  I.fillField(fields.givenName, patient.person.names[0].givenName);
  I.fillField(fields.familyName, patient.person.names[0].familyName);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 10);

  validateRequiredFields(I, RegistrationDashboardPage, 'Gender', 1);
  I.say(`${LOG_TAG} Select the gender and move to Age tab`);
  I.click(patient.person.gender == 'F' ? RegistrationDashboardPage.translate('COMMON_MALE') : RegistrationDashboardPage.translate('COMMON_MALE'));
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegistrationDashboardPage, 'Birth Date', 1);
  I.say(`${LOG_TAG} Fill in the birth date and move to Address tab`);
  I.click(fields.birthDate);
  I.fillField(fields.birthDate, patient.person.birthdate);
  I.click('Done');
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegistrationDashboardPage, 'Address', 4);
  I.say(`${LOG_TAG} Fill in the address and move to Contacts tab`);
  I.fillField(fields.street, patient.contacts.street);
  I.fillField(fields.cell, patient.contacts.cell);
  I.fillField(fields.neighborhood, patient.contacts.neighborhood);
  I.fillField(fields.locality, patient.contacts.locality);
  I.fillField(fields.administrativePost, patient.contacts.administrativePost);
  I.fillField(fields.district, patient.contacts.district);
  I.fillField(fields.province, patient.contacts.province);
  I.fillField(fields.country, patient.contacts.country);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegistrationDashboardPage, 'Provenience', 1);
  I.say(`${LOG_TAG} Select a provenience and move to Testing tab`);
  I.selectOption(fields.provenience, patient.contacts.provenience);
  I.waitForInvisible('#overlay', 5);

  I.say(`${LOG_TAG} Ignore the testing and move to confirmation page`);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  I.say(`${LOG_TAG} Scroll down and confirm patient registration`);
  I.click(nextStepButton);
  I.scrollPageToBottom();
  I.click(RegistrationDashboardPage.buttons.confirm);
  I.waitForInvisible('#overlay', 5);

  I.see(RegistrationDashboardPage.translate('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
})

// Clicks the next button without filling required fields
const validateRequiredFields = (I, RegistrationDashboardPage, step, numOfVisibleElements) => {
  const errorMessageElement = '[ng-message="required"]';

  I.say(`${LOG_TAG} Try to skip the ` + step);
  I.click(RegistrationDashboardPage.buttons.nextStep);
  // TODO: Find a way to check the required message is for a certain field
  I.seeNumberOfVisibleElements(errorMessageElement, numOfVisibleElements);
}
