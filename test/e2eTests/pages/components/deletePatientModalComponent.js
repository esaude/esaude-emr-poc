const Component = require('./component');

const LOG_TAG = '[DeletePatientModalComponent]';

class DeletePatientModalComponent extends Component {
  constructor() {
    super();

    this.modalDialog = '.modal-dialog';

    this.isDead = '[name="isDead"]';

    this.fields = {
      deathReason: { css: 'form select[id=death_reason]' },
      deathDate: '[name="deathDate"]',
      deleteReason: '#reasonDelete',
    };
  }

  deletePatientModalIsLoaded() {
    const cancelButton = '.modal-footer .btn-default';
    this.I.waitForElement(this.modalDialog, 5);
    this.I.see(this.translate('DELETE_PATIENT'));
    this.I.seeElement(cancelButton);
    this._verifySaveButtonIsDisabled();
  }

  deletePatient(deleteReason) {
    this.I.say(`${LOG_TAG} Deleting the patient`);
    this.I.fillField(this.fields.deleteReason, deleteReason);
    this._clickSaveButton();
  }

  declarePatientAsDead(deathReason, deathDate) {
    this.I.say(`${LOG_TAG} Declaring the patient as dead`);
    this.I.selectOption(this.fields.deathReason, deathReason);
    this.I.click(this.fields.deathDate);
    this.I.fillField(this.fields.deathDate, deathDate);
    this.I.click('Done');
    this._clickSaveButton();
  }

  verifyRestrictionToDeletePatient() {
    const alertElement = '.alert-info';
    const disabledCheckbox = locate('button').withAttr({ name: 'isDead', disabled: 'disabled' });
    this.I.say(`${LOG_TAG} Verifying that it is not possible to delete the patient`);
    this.I.waitForElement(alertElement, 10);
    this.I.see(this.translate('COMMON_CANT_DELETE_PATIENT_WITH_HISTORY'), alertElement);
    this.I.seeElement(disabledCheckbox);
    this._verifySaveButtonIsDisabled();
  }

  checkIsDeadBox() {
    this.I.say(`${LOG_TAG} Checking the isDead checkbox`);
    this.I.checkOption(this.isDead);
  }

  verifyPatientDeathDetails(deathDetails) {
    this.I.say(`${LOG_TAG} Verifying patient death details`);
    const patientHeader = '.patientdeceased';
    this.I.waitForElement(patientHeader, 10);
    this.I.see(`${this.translate('PATIENT_IS_DEAD')} ${this.translate('COMMON_AT')}: ${deathDetails.date} ${this.translate('PATIENT_INFO_DEATH_REASON')}: ${deathDetails.reason}`);

    this.I.say(`${LOG_TAG} Verifying the edit and delete buttons are disabled`);
    const disabledEditButton = locate('button').withAttr({ id: 'edit_patient', disabled: 'disabled' });
    const disabledDeleteButton = locate('button').withAttr({ id: 'delete_patient', disabled: 'disabled' });
    this.I.waitForElement('#delete_patient', 10);
    // this.I.seeElement(disabledEditButton); // There is a bug on the system... this should be disabled. Issue #563 (github)
    this.I.seeElement(disabledDeleteButton);
  }

  _verifySaveButtonIsDisabled() {
    const disabledSaveButton = locate('button').withAttr({ disabled: 'disabled' }).withText(this.translate('SAVE'));
    this.I.seeElement(disabledSaveButton);
  }

  _clickSaveButton() {
    const saveButton = '.modal-footer .btn-primary';
    this.I.click(saveButton);
    this.I.waitForInvisible('#overlay', 5);
  }
}

module.exports = DeletePatientModalComponent;
