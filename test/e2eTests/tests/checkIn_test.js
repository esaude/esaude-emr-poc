const assert = require('assert');

// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02

Feature('Check In Patient');

const LOG_TAG = '[CheckInTests]';

let Patient1 = null;

Before(async (I, Apis, Data) => {
  I.say(`${LOG_TAG} Creating patient one`);
  Patient1 = await Apis.patient.create(Data.patients.patient1);
});

After(async (I, Apis, Data) => {
  // Removes the visit if it was created
  const cleanUpPatientVisit = async (patient) => {
    I.say(`${LOG_TAG} Deleting any visits created through the UI`);

    I.say(`${LOG_TAG} Getting all visits associated with patient ${patient.uuid}`);
    const visits = await Apis.visit.getAll({ patient: patient.uuid });

    I.say(`${LOG_TAG} Deleting ${visits.length} visits associated with patient ${patient.uuid}`);
    if(visits.length) {
      visits.forEach(async v => await Apis.visit.delete(v));
    }
  };

  // Removes the encounter if it was created
  const cleanUpPatientEncounter = async (patient) => {
    I.say(`${LOG_TAG} Deleting any encounters created through the UI`);

    I.say(`${LOG_TAG} Getting all encounters associated with patient ${patient.uuid}`);
    const encounters = await Apis.encounter.getAll({ patient: patient.uuid });

    I.say(`${LOG_TAG} Deleting ${encounters.length} encounters associated with patient ${patient.uuid}`);
    if(encounters.length) {
      encounters.forEach(async v => await Apis.encounter.delete(v));
    }
  };

  // If this test passed then a visit or encounter was created
  // If so, it needs to be deleted so the patient can be cleaned up
  // Since the visit/encounter was not created with Apis it needs to be cleaned manually
  await cleanUpPatientEncounter(Patient1);
  await cleanUpPatientVisit(Patient1);
});

Scenario('Check in through registration dashbaord', async (I, Apis, Data, RegistrationDashboardPage) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Disable auto-select`);
  registrationPage.disableAutoSelect();

  I.say(`${LOG_TAG} Search for patient 1's identifier`);
  registrationPage.searchForPatientByIdAndSelect(Data.patients.patient1);

  I.say(`${LOG_TAG} Make sure the registration dashboard page is loaded`);
  RegistrationDashboardPage.isLoaded();

  I.say(`${LOG_TAG} Click on the check in button`);
  RegistrationDashboardPage.clickCheckIn();

  I.say(`${LOG_TAG} Validate the check in message appears`);
  RegistrationDashboardPage.verifyCheckIn();
});

Scenario('Add vitals through clinic dashboard', async (I, Apis, ClinicDashboardPage, Data) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the clinical page`);
  const clinicPage = dashboardPage.navigateToClinicPage();

  I.say(`${LOG_TAG} Disable auto-select`);
  clinicPage.disableAutoSelect();

  I.say(`${LOG_TAG} Search for patient 1's identifier`);
  clinicPage.searchForPatientByIdAndSelect(Data.patients.patient1);

  I.say(`${LOG_TAG} Make sure the clinic dashboard page is loaded`);
  ClinicDashboardPage.isLoaded();

  I.say(`${LOG_TAG} Select the consultation tab`);
  ClinicDashboardPage.clickConsultationTab();

  I.say(`${LOG_TAG} Click the add vitals button`);
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
  // eslint-disable-next-line angular/json-functions
  I.say(`${LOG_TAG} Using form data ${JSON.stringify(formData, null, 2)}`);

  I.say(`${LOG_TAG} Fill in the vitals form`);
  vitalsAdultFormPage.fillForm(formData);

  I.say(`${LOG_TAG} Click the next button`);
  vitalsAdultFormPage.clickNext();

  I.say(`${LOG_TAG} Verify the form data is correct`);
  vitalsAdultFormPage.verifyForm(formData);

  I.say(`${LOG_TAG} Click the confirm button`);
  const clinicDashboardPage = vitalsAdultFormPage.clickConfirm();
});

Scenario('Check in through pharmacy dashboard', async (I, Apis, Data, PharmacyDashboardPage) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Click pharmacy app`);
  const pharmacyPage = dashboardPage.navigateToPharmacyPage();

  I.say(`${LOG_TAG} Disable auto-select`);
  pharmacyPage.disableAutoSelect();

  I.say(`${LOG_TAG} Search for patient 1's identifier`);
  pharmacyPage.searchForPatientByIdAndSelect(Data.patients.patient1);

  I.say(`${LOG_TAG} Make sure the pharmacy dashboard page loaded`);
  PharmacyDashboardPage.isLoaded();

  I.say(`${LOG_TAG} Click on the check in button`);
  PharmacyDashboardPage.clickCheckIn();

  I.say(`${LOG_TAG} Validate the check in message appears`);
  PharmacyDashboardPage.verifyCheckIn();
});
