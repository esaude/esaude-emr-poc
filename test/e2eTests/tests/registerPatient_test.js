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

Scenario('Validate tab sequence', (I, RegisterPatientPage) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  registrationPage.clickNewPatienButton();

  I.say(`${LOG_TAG} Make sure the register patient page is loaded`);
  RegisterPatientPage.isLoaded();

  const tabSequenseMessage = RegisterPatientPage.translate('FOLLOW_SEQUENCE_OF_TABS');

  I.say(`${LOG_TAG} Validating tab sequence`);

  I.click(RegisterPatientPage.tabs.name);
  I.see(RegisterPatientPage.translate('ERROR_REQUIRED'));

  I.click(RegisterPatientPage.tabs.gender);
  I.see(tabSequenseMessage);

  I.click(RegisterPatientPage.tabs.age);
  I.see(tabSequenseMessage);

  I.click(RegisterPatientPage.tabs.address);
  I.see(tabSequenseMessage);

  I.click(RegisterPatientPage.tabs.contacts);
  I.see(tabSequenseMessage);

  I.click(RegisterPatientPage.tabs.testing)
  I.see(tabSequenseMessage);
})

Scenario('Validate Identifiers', (I, RegisterPatientPage) => {
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
  registrationPage.clickNewPatienButton();

  I.say(`${LOG_TAG} Make sure the register patient page is loaded`);
  RegisterPatientPage.isLoaded();

  validateIdentifier(I, RegisterPatientPage, identifierTypes.NIDTARV);

  addIdentifier(I, RegisterPatientPage, identifierTypes.BI);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.BI);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.ATS);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.ATS);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.ITS);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.ITS);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.PTVMATERN);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.PTVMATERN);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.PTVPRE);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.PTVPRE);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.NIDCCR);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.NIDCCR);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.NIT);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.NIT);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.NCC);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.NCC);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  addIdentifier(I, RegisterPatientPage, identifierTypes.PCR);
  validateIdentifier(I, RegisterPatientPage, identifierTypes.PCR);
  I.click(RegisterPatientPage.buttons.removeIdentifier);

  I.say(`${LOG_TAG} Try to add an already added identifier`);
  addIdentifier(I, RegisterPatientPage, identifierTypes.BI);
  addIdentifier(I, RegisterPatientPage, identifierTypes.BI);
  I.see(RegisterPatientPage.translate('PATIENT_INFO_IDENTIFIER_ERROR_EXISTING'));
})

Scenario('Register a patient', (I, Data, RegisterPatientPage) => {
  const patient = Data.patients.patient3;
  const nextStepButton = RegisterPatientPage.buttons.nextStep;
  const fields = RegisterPatientPage.fields;

  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Click on the New Patient button`);
  registrationPage.clickNewPatienButton();

  I.say(`${LOG_TAG} Make sure the register patient page is loaded`);
  RegisterPatientPage.isLoaded();

  validateRequiredFields(I, RegisterPatientPage, 'Identifier', 1);
  I.say(`${LOG_TAG} Fill in the NID identifier and move to Name tab`);
  I.fillField(fields.nid, patient.identifiers[0].identifier3);
  I.waitForInvisible('#overlay', 5);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegisterPatientPage, 'Names', 2);
  I.say(`${LOG_TAG} Fill in givenName and familyName and move to Gender tab`);
  I.fillField(fields.givenName, patient.person.names[0].givenName);
  I.fillField(fields.familyName, patient.person.names[0].familyName);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 10);

  validateRequiredFields(I, RegisterPatientPage, 'Gender', 1);
  I.say(`${LOG_TAG} Select the gender and move to Age tab`);
  I.click(patient.person.gender == 'F' ? RegisterPatientPage.translate('COMMON_MALE') : RegisterPatientPage.translate('COMMON_MALE'));
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegisterPatientPage, 'Birth Date', 1);
  I.say(`${LOG_TAG} Fill in the birth date and move to Address tab`);
  I.click(fields.birthDate);
  I.fillField(fields.birthDate, patient.person.birthdate);
  I.click('Done');
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  validateRequiredFields(I, RegisterPatientPage, 'Address', 4);
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

  validateRequiredFields(I, RegisterPatientPage, 'Provenience', 1);
  I.say(`${LOG_TAG} Select a provenience and move to Testing tab`);
  I.selectOption(fields.provenience, patient.contacts.provenience);
  I.waitForInvisible('#overlay', 5);

  I.say(`${LOG_TAG} Ignore the testing and move to confirmation page`);
  I.click(nextStepButton);
  I.waitForInvisible('#overlay', 5);

  I.say(`${LOG_TAG} Scroll down and confirm patient registration`);
  I.click(nextStepButton);
  I.scrollPageToBottom();
  I.click(RegisterPatientPage.buttons.confirm);
  I.waitForInvisible('#overlay', 5);

  I.see(RegisterPatientPage.translate('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
})

// Clicks the next button without filling required fields
const validateRequiredFields = (I, RegisterPatientPage, step, numOfVisibleElements) => {
  const errorMessageElement = '[ng-message="required"]';

  I.say(`${LOG_TAG} Try to skip the ` + step);
  I.click(RegisterPatientPage.buttons.nextStep);
  // TODO: Find a way to check the required message is for a certain field
  I.seeNumberOfVisibleElements(errorMessageElement, numOfVisibleElements);
}

const addIdentifier = (I, RegisterPatientPage, identifier) => {
  I.say(`${LOG_TAG} Adding ${identifier.label} identifier`);
  I.click(RegisterPatientPage.buttons.addIdentifier);
  I.selectOption(RegisterPatientPage.fields.identifierType, identifier.label);
  I.wait(1);
}

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
}
