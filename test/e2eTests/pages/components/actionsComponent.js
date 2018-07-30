const Component = require('./component');

const LOG_TAG = '[ActionsComponent]';

/**
 * The actions that a user can take on a patient
 * @extends Component
 */
class ActionsComponent extends Component {
  constructor() {
    super();

    this.actionButtons = {
      back: { css: '#add_patient' },
      transferPatient: { css: '#transfer_patient' },
      viewPatient: { css: '#detail_patient' },
      editPatient: { css: '#edit_patient' },
      deletePatient: { css: '#delete_patient' },
      clinic: { css: '#clinic' },
      lab: { css: '#lab' },
      pharmacy: { css: '#pharmacy' },
      registration: { css: '#registration' },
      report: { css: '#reports' },
      social: { css: '#social' },
      vitals: { css: '#vitals' },
    };
  }

  /**
   * Returns to a page depending on the current dashboard page
   * @param {Page} returnPage - the page to return to
   */
  clickBackFromDashboard(returnPage) {
    this._clickButton('back', this.actionButtons.back);
    returnPage.isLoaded();
  }

  /**
   * Pops up a dialog window with buttons to transfer the patient from
   * one app/module to another
   */
  clickTransferPatientButton() {
    this._clickButton('transfer', this.actionButtons.transferPatient);

    const dialogBox = '.ngdialog';
    this.I.say(`${LOG_TAG} verify the dialog popped up`);
    this.I.waitForElement(dialogBox, 10);
    this.I.see(this.translate('COMMON_MOVE_PATIENT'));
  }

  /** Opens the patient details page */
  clickViewPatientButton() {
    this._clickButton('view', this.actionButtons.viewPatient);
    const patientDetailPage = require('./../patientDetailPage');
    patientDetailPage._init();
    patientDetailPage.isLoaded();
    return patientDetailPage;
  }

  /** Clicks the edit button and opens the edit patient page */
  clickEditPatientButton() {
    this._clickButton('edit', this.actionButtons.editPatient);
    const editPatientPage = require('./../editPatientPage');
    editPatientPage._init();
    editPatientPage.isLoaded();
    return editPatientPage;
  }

  /** Clicks the delete patient button */
  clickDeletePatientButton() {
    this._clickButton('delete', this.actionButtons.deletePatient);
    // const deletePatientModal = require('./../windows/deletePatientModal.js');
    // deletePatientModal._init();
    // deletePatientModal.hasPoppedUp();
    // return deletePatientModal;
  }

  /** Transfer Patient to the registration module */
  transferToRegistrationModule() {
    return this._transferTo(this.actionButtons.registration, 'registrationDashboardPage.js');
  }

  /** Transfer Patient to the social module */
  transferToSocialModule() {
    return this._transferTo(this.actionButtons.social, 'socialDashboardPage.js');
  }

  /** Transfer Patient to the vitals module */
  transferToVitalsModule() {
    return this._transferTo(this.actionButtons.vitals, 'vitalsDashboardPage.js');
  }

  /** Transfer Patient to the clinic module */
  transferToClinicModule() {
    return this._transferTo(this.actionButtons.clinic, 'clinicDashboardPage.js');
  }

  /** Transfer Patient to the pharmacy module */
  transferToPharmacyModule() {
    return this._transferTo(this.actionButtons.pharmacy, 'pharmacyDashboardPage.js');
  }

  /** Transfer Patient to the lab module */
  transferToLabModule() {
    return this._transferTo(this.actionButtons.lab, 'labDashboardPage.js');
  }

  /** Transfer Patient to the report module */
  transferToReportsModule() {
    return this._transferTo(this.actionButtons.report, 'reportsDashboardPage.js');
  }

  /**
    * Clicks the given button
    * @param {string} buttonName - the name of the button being clicked
    * @param {object} buttonElement - a css selector for the button
    */
  clickButton(buttonName, buttonElement) {
    this.I.say(`${LOG_TAG} Clicking on the ${buttonName} button`);
    this.I.click(buttonElement);
    this.I.waitForInvisible('#overlay', 10);
  }

  /** Transfer the patient to an app by clicking the app's button */
  _transferTo(button, newPageFile) {
    const dashboardIndexOf = newPageFile.indexOf('Dashboard');
    const newPageName = newPageFile.substr(0, dashboardIndexOf);

    this.I.say(`${LOG_TAG} Transfering the patient to ${newPageName} module`);
    this.I.waitForElement(button.css, 5);
    this.I.click(button);
    this.I.waitForInvisible('#overlay', 5);

    const page = require(`./../${newPageFile}`);
    page._init();

    // Wait for URL update
    this.I.wait(3);
    page.isLoaded();
    return page;
  }
}

module.exports = ActionsComponent;
