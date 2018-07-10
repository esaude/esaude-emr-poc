const Page = require('./page');

const LOG_TAG = '[RegistrationDashboardPage]';

class RegistrationDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ui-sref="dashboard.program"]',
        urlPart: '/registration/#/dashboard',
      },
      components: ['checkIn', 'tabs'],
    });
    this.tabs = {
      programs: 'a[ui-sref="dashboard.program"]',
    };

    this.programs = {
      SERVICE_TAVR_CHECKUP: this.translate('COMMON_PROGRAM_TITLE_SERVICE_TAVR_CHECKUP'),
      SERVICE_TAVR_TREATMENT: this.translate('COMMON_PROGRAM_TITLE_SERVICE_TAVR_TREATMENT'),
      TUBERCULOSIS: this.translate('COMMON_PROGRAM_TITLE_TUBERCULOSIS'),
      CCU: this.translate('COMMON_PROGRAM_TITLE_CCU'),
      CCR: this.translate('COMMON_PROGRAM_TITLE_CCR'),
      PTV_ETV: this.translate('COMMON_PROGRAM_TITLE_PTV_ETV'),
      MOBILE_CLINIC: this.translate('COMMON_PROGRAM_TITLE_MOBILE_CLINIC'),
    };

    this.states = {
      ACTIVO_NO_PROGRAMA: this.translate('COMMON_PROGRAM_STATE_ACTIVE_ON_PROGRAM'),
      DELIVERED: this.translate('COMMON_PROGRAM_STATE_DELIVERED'),
    };

    this.alerts = {
      NO_PROGRAM: this.translate('COMMON_PROGRAM_ENROLLMENT_ERROR_NO_PROGRAM'),
      NO_ADMISSION_DATE: this.translate('COMMON_PROGRAM_ENROLLMENT_ERROR_NO_ADMISSION_DATE'),
      ALREADY_ENROLLED: this.translate('COMMON_PROGRAM_ENROLLMENT_ERROR_ALREADY_ENROLLED'),
      FIVE_YEARS_OR_YOUNGER: this.translate('COMMON_PROGRAM_COMPLETION_ERROR_FIVE_YEARS_OR_YOUNGER'),
      LESS_THAN_18_MONTHS: this.translate('COMMON_PROGRAM_COMPLETION_ERROR_YOUNGER_THAN_EIGHTEEN_MONTHS'),
      NOT_IN_FUTURE: this.translate('COMMON_PROGRAM_ENROLLMENT_DATE_NOT_IN_FUTURE'),
    };
  }

  clickProgramsTab() {
    this.clickTab(this.tabs.programs);
  }

  enrollInProgram(programType, state, admissionDate) {
    this.I.say(`${LOG_TAG} enrolling patient in program with the following data` +
        JSON.stringify({ // eslint-disable-line angular/json-functions
            programType,
            state,
            admissionDate,
        }));

    this.clickAddProgramButton();
    this.selectProgramType(programType);
    this.selectState(state);
    this.enterAdmissionDate(admissionDate);
    this.clickConfirmNewProgram();
  }

  clickAddProgramButton() {
    const addProgramButton = `[data-target="#addProgramModal"]`;
    
    this.I.say(`${LOG_TAG} Click the add program button`);
    this.I.waitForElement(addProgramButton, 5);
    this.I.click(addProgramButton);

    this.I.say(`${LOG_TAG} waiting for the add programs modal to load`);
    this.I.wait(1);
  }

  selectProgramType(programType) {
    this.I.say(`${LOG_TAG} Selecting program type ${programType}`);
    const selectElement = '[ng-model="$parent.programSelected"]';
    const optionLabel = programType;
    this._selectOptionInDropDown(selectElement, optionLabel);
  }

  selectState(programState) {
    if(!programState) {
      return;
    }

    this.I.say(`${LOG_TAG} Selecting program state ${programState}`);
    const selectElement = '[ng-model="$parent.workflowStateSelected"]';
    const optionLabel = programState;
    this._selectOptionInDropDown(selectElement, optionLabel);
  }

  enterAdmissionDate(admissionDate) {
    const datePickerInput = '[ng-model="$parent.programEnrollmentDate"]';

    this.I.say(`${LOG_TAG} Click the admissions date picker input element to popup the date picker`);
    this.I.click(datePickerInput);

    this.I.say(`${LOG_TAG} Wait for the date picker element to appear`);
    const datePickerCalendar = '.uib-datepicker-popup';
    this.I.waitForElement(datePickerCalendar);

    // Now that the calendar is open we can fill the date picker without
    // the calendar popping up and taking focus
    this.I.say(`${LOG_TAG} Enter ${admissionDate} into date picker`);
    this.I.fillField(datePickerInput, admissionDate);

    this.I.say(`${LOG_TAG} Click on the calendar button to close date picker`);
    const closeButton = '.modal-body .glyphicon-calendar';
    this.I.click(closeButton);

    this.I.say(`${LOG_TAG} wait for the date picker to close`);
    this.I.wait(1);
  }

  clickConfirmNewProgram() {
    this.I.say(`${LOG_TAG} Submitting new program`);
    const confirmButton = '.modal-footer .btn-primary';
    this.I.click(confirmButton);
  }

  verifySuccessfulProgramEnrollment() {
    this.I.say(`${LOG_TAG} verify the success toast popped up`);
    const successElement = '.toast-success';
    this.I.waitForElement(successElement, 10);

    this.I.say(`${LOG_TAG} Wait for the modal to dissappear`);
    const modal = '#addProgramModal';
    this.I.waitForInvisible(modal);
    this.I.wait(1);

    this.I.say(`${LOG_TAG} close the success toast`);
    const closeToastElement = '.toast-close-button';
    this.I.click(closeToastElement);
  }

  verifyModalAlert(alert) {
    this.I.say(`${LOG_TAG} verify the alert '${alert}' popped up on the modal`);
    const alertElement = '#addProgramModal .alert strong';
    this.I.waitForElement(alertElement, 10);
    this.I.see(alert, alertElement);
  }

  closeEnrollInProgramModal() {
    this.I.say(`${LOG_TAG} closing the enroll in program modal`);
    const closeElement = '#addProgramModal .close';
    this.I.click(closeElement);

    const modal = '#addProgramModal';
    this.I.waitForInvisible(modal);
    this.I.wait(1);
  }

  _selectOptionInDropDown(selectElement, optionLabel) {
    this.I.say(`${LOG_TAG} Wait for select element ${selectElement} to appear`);
    this.I.waitForElement(selectElement);

    this.I.say(`${LOG_TAG} Click option element with label ${optionLabel} in select element ${selectElement}`);
    this.I.selectOption(selectElement, optionLabel);
  }
}

module.exports = new RegistrationDashboardPage();
