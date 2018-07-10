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
      patients.forEach(async patient => await Apis.patient.delete(patient));
    }
  };

  await cleanUpPatient(Data.patients.patient3);
});

Scenario('Validate tab sequence', (I) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  const registerPatientPage = registrationPage.clickNewPatienButton();

  const tabSequenseMessage = registerPatientPage.translate('FOLLOW_SEQUENCE_OF_TABS');

  I.say(`${LOG_TAG} Validating tab sequence`);

  I.click(registerPatientPage.tabs.name);
  I.see(registerPatientPage.translate('ERROR_REQUIRED'));

  I.click(registerPatientPage.tabs.gender);
  I.see(tabSequenseMessage);

  I.click(registerPatientPage.tabs.age);
  I.see(tabSequenseMessage);

  I.click(registerPatientPage.tabs.address);
  I.see(tabSequenseMessage);

  I.click(registerPatientPage.tabs.contacts);
  I.see(tabSequenseMessage);

  I.click(registerPatientPage.tabs.testing);
  I.see(tabSequenseMessage);
});

Scenario('Validate Identifiers', (I) => {
  const identifierTypes = {
    NIDTARV: {
      label: 'NID (SERVICO TARV)',
      format: 'PPDDUUSS/AA/NNNNN',
      values: ['PPDDUUSS/AA/NNNNN', '11223344011012345', '11223344/AA/12345', '99999999/99/123456', '99999999/99/12345'],
    },
    BI: {
      label: 'BILHETE DE IDENTIDADE (BI)',
      format: '000000000X',
      values: ['ABCDEFGHIJKL', '123456789123', 'A123456789', '123456789x', '123456789X'],
    },
    ATS: {
      label: 'CODIGO ATS/UATS',
      format: 'YY/####',
      values: [],
    },
    ITS: {
      label: 'CODIGO ITS',
      format: 'YY/####',
      values: [],
    },
    PTVMATERN: {
      label: 'CODIGO PTV (MATERNIDADE)',
      format: 'YY/####',
      values: [],
    },
    PTVPRE: {
      label: 'CODIGO PTV (PRE-NATAL)',
      format: 'YY/####',
      values: [],
    },
    NIDCCR: {
      label: 'NID (CCR)',
      format: 'YY/####CE',
      values: [],
    },
    NIT: {
      label: 'NIT (SECTOR DE TB)',
      format: '',
      values: [],
    },
    NCC: {
      label: 'NUMERO CANCRO CERVICAL',
      format: 'NNNNNN/20_ _',
      values: [],
    },
    PCR: {
      label: 'PCR (NUMERO DE REGISTO)',
      format: '',
      values: [],
    },
  };

  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  const registerPatientPage = registrationPage.clickNewPatienButton();

  validateIdentifier(I, registerPatientPage, identifierTypes.NIDTARV);

  addIdentifier(I, registerPatientPage, identifierTypes.BI);
  validateIdentifier(I, registerPatientPage, identifierTypes.BI);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.ATS);
  validateIdentifier(I, registerPatientPage, identifierTypes.ATS);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.ITS);
  validateIdentifier(I, registerPatientPage, identifierTypes.ITS);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.PTVMATERN);
  validateIdentifier(I, registerPatientPage, identifierTypes.PTVMATERN);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.PTVPRE);
  validateIdentifier(I, registerPatientPage, identifierTypes.PTVPRE);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.NIDCCR);
  validateIdentifier(I, registerPatientPage, identifierTypes.NIDCCR);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.NIT);
  validateIdentifier(I, registerPatientPage, identifierTypes.NIT);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.NCC);
  validateIdentifier(I, registerPatientPage, identifierTypes.NCC);
  I.click(registerPatientPage.buttons.removeIdentifier);

  addIdentifier(I, registerPatientPage, identifierTypes.PCR);
  validateIdentifier(I, registerPatientPage, identifierTypes.PCR);
  I.click(registerPatientPage.buttons.removeIdentifier);

  I.say(`${LOG_TAG} Try to add an already added identifier`);
  addIdentifier(I, registerPatientPage, identifierTypes.BI);
  addIdentifier(I, registerPatientPage, identifierTypes.BI);
  I.see(registerPatientPage.translate('PATIENT_INFO_IDENTIFIER_ERROR_EXISTING'));
});

Scenario('Register a patient', (I, Data, RegistrationDashboardPage) => {
  const patient = Data.patients.patient3;

  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  const registerPatientPage = registrationPage.clickNewPatienButton();

  validateRequiredFields(I, registerPatientPage, 'Identifier', 1);
  I.say(`${LOG_TAG} Fill in the NID identifier and move to Name tab`);
  registerPatientPage.fillIdentifierForm(patient);
  I.waitForInvisible('#overlay', 5);
  registerPatientPage.clickNext();

  validateRequiredFields(I, registerPatientPage, 'Names', 2);
  I.say(`${LOG_TAG} Fill in givenName and familyName and move to Gender tab`);
  registerPatientPage.fillNameForm(patient);
  registerPatientPage.clickNext(10);

  validateRequiredFields(I, registerPatientPage, 'Gender', 1);
  I.say(`${LOG_TAG} Select the gender and move to Age tab`);
  registerPatientPage.selectGender(patient);
  registerPatientPage.clickNext();

  validateRequiredFields(I, registerPatientPage, 'Birth Date', 1);
  I.say(`${LOG_TAG} Fill in the birth date and move to Address tab`);
  registerPatientPage.fillBirthDateForm(patient);
  registerPatientPage.clickNext();

  validateRequiredFields(I, registerPatientPage, 'Address', 4);
  I.say(`${LOG_TAG} Fill in the address and move to Contacts tab`);
  registerPatientPage.fillContactForm(patient);
  registerPatientPage.clickNext();

  validateRequiredFields(I, registerPatientPage, 'Provenience', 1);
  I.say(`${LOG_TAG} Select a provenience and move to Testing tab`);
  registerPatientPage.selectProvenience(patient);
  registerPatientPage.clickNext();

  I.say(`${LOG_TAG} Ignore the testing and move to confirmation page`);
  registerPatientPage.clickNext();

  I.say(`${LOG_TAG} Scroll down and confirm patient registration`);
  I.scrollPageToBottom();
  I.click(registerPatientPage.buttons.confirm);
  I.waitForInvisible('#overlay', 5);

  I.see(registerPatientPage.translate('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
  I.wait(1);

  I.say(`${LOG_TAG} Make sure the registration dashboard page loaded`);
  RegistrationDashboardPage.isLoaded();

  // TODO: This could be a component or a method in the page class
  // to verify the loaded patient information
  I.see(patient.identifiers[0].identifier3);
  I.see(patient.person.names[0].givenName);
  I.see(patient.person.names[0].familyName);
});

// Clicks the next button without filling required fields
const validateRequiredFields = (I, RegisterPatientPage, step, numOfVisibleElements) => {
  const errorMessageElement = '[ng-message="required"]';

  I.say(`${LOG_TAG} Try to skip the ${step}`);
  I.click(RegisterPatientPage.buttons.nextStep);
  // TODO: Find a way to check the required message is for a certain field
  I.seeNumberOfVisibleElements(errorMessageElement, numOfVisibleElements);
};

const addIdentifier = (I, RegisterPatientPage, identifier) => {
  I.say(`${LOG_TAG} Adding ${identifier.label} identifier`);
  I.click(RegisterPatientPage.buttons.addIdentifier);
  I.selectOption(RegisterPatientPage.fields.identifierType, identifier.label);
  I.wait(1);
};

const validateIdentifier = (I, RegisterPatientPage, identifier) => {
  const inputField = locate('input').withAttr({ placeholder: identifier.format });
  const helpButton = locate('button').withAttr({ 'uib-popover': identifier.format });

  I.say(`${LOG_TAG} Validating ${identifier.label} identifier`);
  I.seeElement(inputField);

  if (identifier.format != "") {
    I.click(helpButton);
    I.seeElement(locate('div').withText(identifier.format));
    I.click(helpButton);
  }

  for (var i = 0; i < identifier.values.length; i++) {
    I.fillField(inputField, identifier.values[i]);
    I.waitForInvisible('#overlay', 5);

    // Prevent from going to the next page
    if (i < identifier.values.length - 1) {
      I.click(RegisterPatientPage.buttons.nextStep);
      I.see(RegisterPatientPage.translate('ERROR_INVALID_FORMAT'));
    }

    // Add a valid identifier to remove the error message
    // Make sure the last value is always the valid one
    I.fillField(inputField, identifier.values[identifier.values.length - 1]);
  }
  I.wait(1);
};
