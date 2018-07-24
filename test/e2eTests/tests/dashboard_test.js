
Feature('Dashboard');

const LOG_TAG = '[DashboardTests]';

let Patient = null;

// In order to be on the dashboard we must first login
Before(async (I) => {
  I.login();
});

After(async (I, Apis, Data) => {
  // Removes the visit if it was created
  const cleanUpPatientVisit = async (patient) => {
    I.say(`${LOG_TAG} Deleting any visits created through the UI`);

    I.say(`${LOG_TAG} Getting all visits associated with patient ${patient.uuid}`);
    const visits = await Apis.visit.getAll({ patient: patient.uuid });

    I.say(`${LOG_TAG} Deleting ${visits.length} visits associated with patient ${patient.uuid}`);
    if (visits.length) {
      visits.forEach(async v => await Apis.visit.delete(v));
    }
  };
  if (Patient != null) {
    await cleanUpPatientVisit(Patient);
  }
});

Scenario('Logout successfully', (I, DashboardPage) => {
  const logoutStatus = DashboardPage.logout();
  logoutStatus.successful();
});

Scenario('Navigate though dashboards and transfer the patient between dashboards', async (I, Apis, Data, DashboardPage, RegistrationDashboardPage, VitalsPage) => {
  const searchForPatient = (currentPage, patient) => {
    I.say(`${LOG_TAG} Disable auto-select`);
    currentPage.disableAutoSelect();

    I.say(`${LOG_TAG} Search for patient's identifier`);
    currentPage.searchForPatientByIdAndSelect(patient);
  };

  const verifyBreadcrumb = (pageName, isDashboard = true) => {
    const breadcrumbSection = 'ol[class="breadcrumb ng-scope"]';
    const breadcrumbText = `${DashboardPage.translate(pageName)} / ${DashboardPage.translate('SEARCH_PATIENT')}`;
    const breadcrumbElement = isDashboard ? 'a[href="#/search"]' : '.breadcrumb .ng-binding';

    I.say(`${LOG_TAG} Verifying the bradcrumb on the page`);
    I.waitForElement(breadcrumbSection, 10);
    I.seeElement(breadcrumbElement);
    I.see(breadcrumbText);
  };

  const verifyPatientHeader = (patient) => {
    const patientHeader = locate('patient-header');

    // TODO: This should be in utils and there may be some formatter
    const birthdate = new Date(patient.person.birthdate);
    const ageDifMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    let month = birthdate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const formattedDate = `${birthdate.getDate()}/${month}/${birthdate.getFullYear()}`;

    I.say(`${LOG_TAG} Verifying patient header`);
    I.waitForElement(patientHeader, 5);
    I.see(`${patient.person.names[0].givenName} ${patient.person.names[0].familyName}`);
    I.see(`${age} (${formattedDate})`);
    I.see(`NID (SERVICO TARV): ${patient.identifiers[0].identifier}`);
  };

  const verifyVisitHeader = () => {
    const visitHeader = locate('visit-header');

    I.say(`${LOG_TAG} Verifying visit header`);
    I.waitForElement(visitHeader, 5);
    I.see(DashboardPage.translate('REGISTRATION_LAST_VISIT'));
    I.see(DashboardPage.translate('COMMON_CONSULTATION'));
    I.see(DashboardPage.translate('COMMON_PHARMACY'));
    I.see(DashboardPage.translate('VITALS_LAST_BMI'));
  };

  const patient2 = Data.patients.patient2;

  I.say(`${LOG_TAG} Creating the patient`);
  Patient = await Apis.patient.create(patient2);

  I.say(`${LOG_TAG} Navigate to the registration page`);
  const registrationPage = DashboardPage.navigateToRegistrationPage();
  verifyBreadcrumb('APP_REGISTRATION', false);

  searchForPatient(registrationPage, patient2);

  I.say(`${LOG_TAG} Make sure the registration dashboard page is loaded`);
  RegistrationDashboardPage.isLoaded();
  verifyBreadcrumb('APP_REGISTRATION');
  verifyPatientHeader(patient2);

  I.say(`${LOG_TAG} Verify patient has not checked in`);
  I.see(RegistrationDashboardPage.translate('CHECKIN_NOT_CHECKED_IN_TODAY'));

  I.say(`${LOG_TAG} Click on the check in button`);
  RegistrationDashboardPage.clickCheckIn();

  I.say(`${LOG_TAG} Validate the check in message appears`);
  RegistrationDashboardPage.verifyCheckIn();
  I.waitForInvisible('#overlay', 5);

  I.say(`${LOG_TAG} Go back by clicking the breadcrumb link`);
  const link = 'a[href="#/search"]';
  I.click(link);
  I.waitForInvisible('#overlay', 5);
  I.say(`${LOG_TAG} Make sure the registration page is loaded`);
  registrationPage.isLoaded();

  searchForPatient(registrationPage, patient2);

  verifyVisitHeader();
  RegistrationDashboardPage.clickTab(RegistrationDashboardPage.tabs.visits);
  RegistrationDashboardPage.clickTab(RegistrationDashboardPage.tabs.services);
  RegistrationDashboardPage.clickTab(RegistrationDashboardPage.tabs.programs);

  RegistrationDashboardPage.clickTransferPatientButton();

  const socialDashboardPage = RegistrationDashboardPage.transferToSocialModule();
  verifyBreadcrumb('APP_SOCIAL');
  verifyPatientHeader(patient2);
  socialDashboardPage.clickTab(socialDashboardPage.tabs.partners);
  socialDashboardPage.clickTab(socialDashboardPage.tabs.services);
  socialDashboardPage.clickTransferPatientButton();

  const vitalsDashboardPage = socialDashboardPage.transferToVitalsModule();
  verifyBreadcrumb('APP_VITALS');
  verifyPatientHeader(patient2);
  verifyVisitHeader();

  I.say(`${LOG_TAG} Go back by clicking the back action button`);
  vitalsDashboardPage.clickBackFromDashboard(VitalsPage);

  searchForPatient(registrationPage, patient2);
  I.say(`${LOG_TAG} Make sure the vitals dashboard page is loaded`);
  vitalsDashboardPage.isLoaded();
  vitalsDashboardPage.clickTransferPatientButton();

  const clinicDashboardPage = vitalsDashboardPage.transferToClinicModule();
  verifyBreadcrumb('APP_CLINIC');
  verifyPatientHeader(patient2);
  verifyVisitHeader();
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.chart);
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.consultation);
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.prescriptions);
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.laboratory);
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.current);
  clinicDashboardPage.clickTab(clinicDashboardPage.tabs.summary);
  clinicDashboardPage.clickTransferPatientButton();

  const pharmacyDashboardPage = clinicDashboardPage.transferToPharmacyModule();
  verifyBreadcrumb('APP_PHARMACY');
  verifyPatientHeader(patient2);
  verifyVisitHeader();
  pharmacyDashboardPage.clickTab(pharmacyDashboardPage.tabs.filaHistory);
  pharmacyDashboardPage.clickTab(pharmacyDashboardPage.tabs.dispensationHistory);
  pharmacyDashboardPage.clickTab(pharmacyDashboardPage.tabs.dispensation);
  pharmacyDashboardPage.clickTab(pharmacyDashboardPage.tabs.prescriptions);
  pharmacyDashboardPage.clickTransferPatientButton();

  const labDashboardPage = pharmacyDashboardPage.transferToLabModule();
  verifyBreadcrumb('APP_LAB');
  verifyPatientHeader(patient2);
  labDashboardPage.clickTab(labDashboardPage.tabs.testrequest);
  labDashboardPage.clickTab(labDashboardPage.tabs.testorders);
  labDashboardPage.clickTransferPatientButton();

  const reportsDashboardPage = labDashboardPage.transferToReportsModule();

  // No transfer button on the reports dashboard page
  // Navigate to home page
  reportsDashboardPage.clickHome();
});
