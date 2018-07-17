const translator = require('./../../translator');

// Represents a modal window on the POC website
// A Modal has a title and normally a cancel and a save/confirm button
// Subclasses of Modal pass in options that define when the window pops up
// such as the title, cancel and save buttons.
//
class Modal {
  constructor(options) {
    // Initializing the buttons array
    options.buttons = options.buttons || [];
    this.options = options;

    this.modalDialog = '.modal-dialog';

    // if no buttons are provided add the cancel and save buttons
    if (!this.options.buttons.hasOwnProperty('cancel')) {
      this.options.buttons['cancel'] = '.modal-footer .btn-default';
    }
    if (!this.options.buttons.hasOwnProperty('save')) {
      this.options.buttons['save'] = '.modal-footer .btn-primary';
    }
  }

  _init() {
    this.I = actor();
  }

  translate(key) {
    return translator.translate(key);
  }

  hasPoppedUp() {
    this.I.waitForElement(this.modalDialog, 5);
    this.I.see(this.translate(this.options.title));
    this.I.seeElement(this.options.buttons.cancel);
    this.I.seeElement(this.options.buttons.save);
  }

  clickCancelButton() {
    this.I.say(`${this.options.logTag} Clicking on the cancel button`);
    this.I.click(this.options.buttons.cancel);
    this.I.waitForInvisible('#overlay', 5);
  }

  clickSaveButton() {
    this.I.say(`${this.options.logTag} Clicking on the save button`);
    this.I.click(this.options.buttons.save);
    this.I.waitForInvisible('#overlay', 5);
  }

  verifySuccessToast() {
    this.I.say(`${this.options.logTag} verify the success toast popped up`);
    const successElement = '.toast-success';
    this.I.waitForElement(successElement, 10);
  }
}
module.exports = Modal;
