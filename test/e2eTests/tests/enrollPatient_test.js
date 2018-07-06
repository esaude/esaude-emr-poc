Feature('Eroll A Patient');

const LOG_TAG = '[EnrollPatientTest]';

let Patient1 = null;

Before(async (I, Apis, Data) => {
  I.say(`${LOG_TAG} Creating patient one`);
  Patient1 = await Apis.patient.create(Data.patients.patient1);
});

After(async (I, Apis, Data) => {
  // Clean up enrollments
  const cleanUpPatientProgramEnrollments = async (patient) => {
    I.say(`${LOG_TAG} Deleting any enrollments created through the UI`);

    I.say(`${LOG_TAG} Getting all enrollments that this patient is enrolled in. Patient ${patient.uuid}`);
    const enrollments = await Apis.programEnrollment.getAll({ patient: patient.uuid });

    I.say(`${LOG_TAG} Deleting ${enrollments.length} enrollments associated with patient ${patient.uuid}`);
    if(enrollments.length) {
      enrollments.forEach(async enrollment => await Apis.programEnrollment.delete(enrollment));
    }
  };

  await cleanUpPatientProgramEnrollments(Patient1);
});

Scenario('Successfully enroll patient in program', (I, Data, RegistrationDashboardPage) => {
  const enrollInProgram_VerifySuccess_CloseModal = (enrollmentData) => {
    const programType = enrollmentData.programType;
    const state = enrollmentData.state;
    const admissionDate = enrollmentData.admissionDate;

    // This will close the modal
    I.say(`${LOG_TAG} Enroll the patient in a program`);
    RegistrationDashboardPage.enrollInProgram(programType,
      state,
      admissionDate);

    I.say(`${LOG_TAG} Verify successful enrollment`);
    RegistrationDashboardPage.verifySuccessfulProgramEnrollment();
  };

  const enrollInProgram_VerifyAlert_CloseModal = (enrollmentData) => {
    const programType = enrollmentData.programType;
    const state = enrollmentData.state;
    const admissionDate = enrollmentData.admissionDate;
    const alert = enrollmentData.alert;

    I.say(`${LOG_TAG} Enroll the patient in a program`);
    RegistrationDashboardPage.enrollInProgram(programType,
      state,
      admissionDate);

    I.say(`${LOG_TAG} Verify the alert popped up with ${alert}`);
    RegistrationDashboardPage.verifyModalAlert(alert);

    I.say(`${LOG_TAG} closing program enrollment modal`);
    RegistrationDashboardPage.closeEnrollInProgramModal();
  };

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

  // SERVICE TAVR CHECK UP
  enrollInProgram_VerifySuccess_CloseModal({
    programType: RegistrationDashboardPage.programs.SERVICE_TAVR_CHECKUP,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '17/04/2017'
  });

  // CCU
  {
    I.say(`${LOG_TAG} Click the add program button`);
    RegistrationDashboardPage.clickAddProgramButton();
    
    I.say(`${LOG_TAG} Click the confirm button`);
    RegistrationDashboardPage.clickConfirmNewProgram();
    
    I.say(`${LOG_TAG} Verify the alert popped up with ${RegistrationDashboardPage.alerts.NO_PROGRAM}`);
    RegistrationDashboardPage.verifyModalAlert(RegistrationDashboardPage.alerts.NO_PROGRAM);

    const programType = RegistrationDashboardPage.programs.CCU;

    I.say(`${LOG_TAG} Select program type ${programType}`);
    RegistrationDashboardPage.selectProgramType(programType);

    I.say(`${LOG_TAG} Click the confirm button`);
    RegistrationDashboardPage.clickConfirmNewProgram();

    I.say(`${LOG_TAG} Verify the alert popped up with ${RegistrationDashboardPage.alerts.NO_ADMISSION_DATE}`);
    RegistrationDashboardPage.verifyModalAlert(RegistrationDashboardPage.alerts.NO_ADMISSION_DATE);

    const admissionDate = '17/04/2017';

    I.say(`${LOG_TAG} Enter admissions date ${admissionDate}`);
    RegistrationDashboardPage.enterAdmissionDate(admissionDate);

    // This will close the modal
    I.say(`${LOG_TAG} Click the confirm button`);
    RegistrationDashboardPage.clickConfirmNewProgram();

    I.say(`${LOG_TAG} Verify successful enrollment`);
    RegistrationDashboardPage.verifySuccessfulProgramEnrollment();
  }

  enrollInProgram_VerifyAlert_CloseModal({
    programType: RegistrationDashboardPage.programs.SERVICE_TAVR_CHECKUP,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '17/04/2017',
    alert: RegistrationDashboardPage.alerts.ALREADY_ENROLLED,
  });
/*
  enrollInProgram_VerifyAlert_CloseModal({
    programType: RegistrationDashboardPage.programs.PTV_ETV,
    state: RegistrationDashboardPage.states.DELIVERED,
    admissionDate: '16/01/2017',
    alert: RegistrationDashboardPage.alerts.FIVE_YEARS_OR_YOUNGER,
  });
*/
  enrollInProgram_VerifyAlert_CloseModal({
    programType: RegistrationDashboardPage.programs.CCR,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '16/07/2017',
    alert: RegistrationDashboardPage.alerts.LESS_THAN_18_MONTHS,
  });

  // SERVICE TARV TREATMENT
  enrollInProgram_VerifySuccess_CloseModal({
    programType: RegistrationDashboardPage.programs.SERVICE_TAVR_TREATMENT,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '10/05/2017',
  });

  // MOBILE CLINIC
  enrollInProgram_VerifySuccess_CloseModal({
    programType: RegistrationDashboardPage.programs.MOBILE_CLINIC,
    state: undefined,
    admissionDate: '06/04/2017',
  });

  enrollInProgram_VerifyAlert_CloseModal({
    programType: RegistrationDashboardPage.programs.TUBERCULOSIS,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '01/03/2038',
    alert: RegistrationDashboardPage.alerts.NOT_IN_FUTURE,
  });

  // TUBERCULOSIS
  enrollInProgram_VerifySuccess_CloseModal({
    programType: RegistrationDashboardPage.programs.TUBERCULOSIS,
    state: RegistrationDashboardPage.states.ACTIVE_ON_PROGRAM,
    admissionDate: '01/03/2017',
  });
});
