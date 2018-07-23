
Feature('Dashboard');

const LOG_TAG = '[DashboardTests]';

// In order to be on the dashboard we must first login
Before(async (I) => {
  I.login();
});

Scenario('Logout successfully', (I, DashboardPage) => {
  const logoutStatus = DashboardPage.logout();
  logoutStatus.successful();
});

Scenario('Navigate though dashboards and transfer the patient between dashboards', async (I, Apis, Data, DashboardPage, RegistrationDashboardPage) => {
  I.say(`${LOG_TAG} Creating the patient`);
  Patient = await Apis.patient.create(Data.patients.patient2);

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = DashboardPage.navigateToRegistrationPage();

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
