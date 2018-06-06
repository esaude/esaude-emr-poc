const assert = require('assert');

// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02

Feature('Check In Patient');

let Patient1 = null;
let Patient2 = null;

Before(async (I, Apis, Data) => {
  I.say('Creating patient one');
  Patient1 = await Apis.patient.create(Data.users.patient1);

  I.say('Creating patient one');
  Patient2 = await Apis.patient.create(Data.users.patient2);
});

After(async (I, Apis, Data) => {
  I.say('Deleting any visits created through the UI');

  I.say('Getting all visits associated with this patient');
  const visits = await Apis.visit.getAll({ patient: Patient1.uuid });

  assert(visits.length, 1, 'This patient should only have 1 visit');

  I.say(`Deleting ${visits.length} associated with patient 1`);
  visits.forEach(async v => await Apis.visit.delete(v));
});

Scenario('', async (I, Apis, ClinicDashboardPage, Data, RegistrationDashboardPage) => {
  I.say('login');
  let dashboardPage = I.login();

  I.say('Navigate to the registration page');
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say('Disable auto-select');
  registrationPage.disableAutoSelect();

  I.say('Search for patient 1\'s identifier');
  registrationPage.search(Data.users.patient1.identifiers[0].identifier);

  I.say('Validate patient 1\'s data is visible');
  registrationPage.seePatientRecord(Data.users.patient1);

  I.say('Select patient 1');
  registrationPage.clickSearchResult(Data.users.patient1);

  I.say('Make sure the registration dashboard page is loaded');
  RegistrationDashboardPage.isLoaded();

  I.say('Click on the check in button');
  RegistrationDashboardPage.clickCheckIn();

  I.say('Validate the check in message appears');
  I.see('Deu entrada hoje em');

  I.say('Click home')
  dashboardPage = RegistrationDashboardPage.clickHome()

  I.say('Navigate to the clinical page');
  const clinicPage = dashboardPage.navigateToClinicPage();

  I.say('Disable auto-select');
  clinicPage.disableAutoSelect();

  I.say('Search for patient 2\'s identifier');
  clinicPage.search(Data.users.patient2.identifiers[0].identifier);

  I.say('Validate patient 2\'s data is visible');
  clinicPage.seePatientRecord(Data.users.patient2);

  I.say('Select patient 2');
  clinicPage.clickSearchResult(Data.users.patient2);

  I.say('Make sure the registration dashboard page is loaded');
  ClinicDashboardPage.isLoaded();

  I.say('Select the consultation tab');
  ClinicDashboardPage.clickConsultationTab();

  I.say('Click the add vitals button');
  const vitalsAdultFormPage = ClinicDashboardPage.clickAddVitals();

  const formData = {
    temperature: '37',
    weight: '60',
    height: '152',
    systolicBloodPressure: '110',
    diastolicBloodPressure: '70',
    cardiacFrequency: '108',
    respiratoryRate: '16',
  };
  I.say(`Using form data ${JSON.stringify(formData, null, 2)}`);

  I.say('Fill in the vitals form');
  vitalsAdultFormPage.fillForm(formData);

  I.say('Click the next button');
  vitalsAdultFormPage.next();

  I.say('Verify the form data is correct');
  vitalsAdultFormPage.verifyForm(formData);
});