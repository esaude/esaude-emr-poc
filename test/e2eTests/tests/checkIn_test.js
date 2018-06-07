const assert = require('assert');

// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02

Feature('Check In Patient');

const LOG_TAG = '[CheckInTests]';

let Patient1 = null;
let Patient2 = null;
let Patient3 = null;

Before(async (I, Apis, Data) => {
  I.say('Creating patient one');
  Patient1 = await Apis.patient.create(Data.users.patient1);

  I.say('Creating patient two');
  Patient2 = await Apis.patient.create(Data.users.patient2);

  I.say('Creating patient three');
  Patient3 = await Apis.patient.create(Data.users.patient3);
});

After(async (I, Apis, Data) => {
  // Removes all visits associated with a patient
  const cleanUpPatientVisits = async (patient) => {
    // If the patient wasn't created yet there's nothing to do
    if(!patient)
      return

    I.say(`${LOG_TAG} Deleting any visits created through the UI`);

    I.say(`${LOG_TAG} Getting all visits associated with patient ${patient.uuid}`);
    const visits = await Apis.visit.getAll({ patient: patient.uuid });

    I.say(`${LOG_TAG} Deleting ${visits.length} associated with patient ${patient.uuid}`);
    visits.forEach(async v => await Apis.visit.delete(v));
  };

  await cleanUpPatientVisits(Patient1);
  await cleanUpPatientVisits(Patient3);
});

Scenario('', async (I, Apis, ClinicDashboardPage, Data, RegistrationDashboardPage, PharmacyDashboardPage) => {
  I.say('login');
  let dashboardPage = I.login();

  I.say('Navigate to the registration page');
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say('Disable auto-select');
  registrationPage.disableAutoSelect();

  I.say('Search for patient 1\'s identifier');
  registrationPage.searchForPatientByIdAndSelect(Data.users.patient1);

  I.say('Make sure the registration dashboard page is loaded');
  RegistrationDashboardPage.isLoaded();

  I.say('Click on the check in button');
  RegistrationDashboardPage.clickCheckIn();

  I.say('Validate the check in message appears');
  RegistrationDashboardPage.verifyCheckIn();

  I.say('Click home')
  dashboardPage = RegistrationDashboardPage.clickHome()

  I.say('Navigate to the clinical page');
  const clinicPage = dashboardPage.navigateToClinicPage();

  I.say('Disable auto-select');
  clinicPage.disableAutoSelect();

  I.say('Search for patient 2\'s identifier');
  clinicPage.searchForPatientByIdAndSelect(Data.users.patient2);

  I.say('Make sure the clinic dashboard page is loaded');
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
  vitalsAdultFormPage.clickNext();

  I.say('Verify the form data is correct');
  vitalsAdultFormPage.verifyForm(formData);

  I.say('Click the confirm button');
  const clinicDashboardPage = vitalsAdultFormPage.clickConfirm();

  I.say('Click home');
  dashboardPage = clinicDashboardPage.clickHome();

  I.say('Click pharmacy app');
  const pharmacyPage = dashboardPage.navigateToPharmacyPage();

  I.say('Disable auto-select');
  pharmacyPage.disableAutoSelect();

  I.say('Search for patient 3\'s identifier');
  pharmacyPage.searchForPatientByIdAndSelect(Data.users.patient3);

  I.say('Make sure the pharmacy dashboard page loaded');
  PharmacyDashboardPage.isLoaded();

  I.say('Click on the check in button');
  PharmacyDashboardPage.clickCheckIn();

  I.say('Validate the check in message appears');
  PharmacyDashboardPage.verifyCheckIn();
});