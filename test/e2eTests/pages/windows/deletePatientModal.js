const Modal = require('./modal');

const LOG_TAG = '[DeletePatientModal]';

class DeletePatientModal extends Modal {
  constructor() {
    super({
      title: 'DELETE_PATIENT',
      logTag: LOG_TAG,
    });

    this.isDead = '[name="isDead"]';

    this.fields = {
      deathReason: { css: 'form select[id=death_reason]' },
      deathDate: '[name="deathDate"]',
      deleteReason: '#reasonDelete',
    };
  }

  deletePatient(deleteReason, returnPage) {
    this.I.say(`${LOG_TAG} Deleting the patient`);
    this.fillDeleteReason(deleteReason);
    this.clickSaveButton();
    this.verifySuccessToast();

    this.I.say(`${LOG_TAG} Make sure the return page is loaded`);
    returnPage.isLoaded();
  }

  declareDead(deathReason, deathDate) {
    this.I.say(`${LOG_TAG} Declaring the patient as dead`);
    this.selectDeathReason(deathReason);
    this.setDeathDate(deathDate);
    this.clickSaveButton();
  }

  fillDeleteReason(reason) {
    this.I.say(`${LOG_TAG} filling in the reason for deleting the patient`);
    this.I.fillField(this.fields.deleteReason, reason);
  }

  verifySaveButtonIsDisabled() {
    this.I.say(`${LOG_TAG} Verifying that the save button is disabled`);
    this.I.seeElement(locate('button').withAttr({ disabled: 'disabled' }).withText(this.translate('SAVE')));
  }

  verifyDeletionImpossibility() {
    this.I.say(`${LOG_TAG} Verifying that it is not possible to delete the patient`);
    const alertElement = '.alert-info';
    this.I.waitForElement(alertElement, 10);
    this.I.see(this.translate('COMMON_CANT_DELETE_PATIENT_WITH_HISTORY'), alertElement);
    this.I.seeElement(locate('button').withAttr({ name: 'isDead', disabled: 'disabled' }));
    this.verifySaveButtonIsDisabled();
  }

  setIsDead() {
    this.I.say(`${LOG_TAG} Checking the isDead checkbox`);
    this.I.checkOption(this.isDead);
  }

  selectDeathReason(optionValue) {
    this.I.say(`${LOG_TAG} Selecting the death reason`);
    this.I.selectOption(this.fields.deathReason, optionValue);
  }

  setDeathDate(deathDate) {
    this.I.click(this.fields.deathDate);
    this.I.fillField(this.fields.deathDate, deathDate);
    this.I.click('Done');
  }
}

module.exports = new DeletePatientModal();
