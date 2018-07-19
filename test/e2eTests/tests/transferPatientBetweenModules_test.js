const assert = require('assert');

Feature('Transfer patient between modules');

const LOG_TAG = '[TransferPatientTests]';

let Patient = null;

Before(async (I, Apis, Data) => {
  I.say(`${LOG_TAG} Creating the patient`);
  Patient = await Apis.patient.create(Data.patients.patient2);
});

Scenario('Transfer patient between modules', async (I, Apis, Data, RegistrationDashboardPage) => {
  I.say(`${LOG_TAG} login`);
  let dashboardPage = I.login();

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = dashboardPage.navigateToRegistrationPage();

  I.say(`${LOG_TAG} Disable auto-select`);
  registrationPage.disableAutoSelect();

  I.say(`${LOG_TAG} Search for patient's identifier`);
  registrationPage.searchForPatientByIdAndSelect(Data.patients.patient2);

  I.say(`${LOG_TAG} Make sure the registration dashboard page is loaded`);
  RegistrationDashboardPage.isLoaded();

  RegistrationDashboardPage.clickTransferPatientButton();

  const socialDashboardPage = RegistrationDashboardPage.transferToSocialModule();
  socialDashboardPage.clickTransferPatientButton();

  const vitalsDashboardPage = socialDashboardPage.transferToVitalsModule();
  vitalsDashboardPage.clickTransferPatientButton();

  const clinicDashboardPage = vitalsDashboardPage.transferToClinicModule();
  clinicDashboardPage.clickTransferPatientButton();

  const pharmacyDashboardPage = clinicDashboardPage.transferToPharmacyModule();
  pharmacyDashboardPage.clickTransferPatientButton();

  const labDashboardPage = pharmacyDashboardPage.transferToLabModule();
  labDashboardPage.clickTransferPatientButton();

  const reportsDashboardPage = labDashboardPage.transferToReportsModule();

  // No transfer button on the reports dashboard page
  // Navigate to home page
  reportsDashboardPage.clickHome();
});
