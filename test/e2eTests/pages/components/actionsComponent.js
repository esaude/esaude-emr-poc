const Component = require('./component');

const LOG_TAG = '[ActionsComponent]';

class ActionsComponent extends Component {
  constructor() {
    super();

    this.buttons = {
      back: { css: '#add_patient' },
      transferPatient: { css: '#transfer_patient' },
      viewPatient: { css: '#detail_patient' },
      editPatient: { css: '#edit_patient' },
      deletePatient: { css: '#delete_patient' },
    };
  }

  clickBackFromDashboard(returnPage) {
    this._clickButton('back', this.buttons.back);
    returnPage.isLoaded();
  }

  // TODO: Centralize the code existing on dashboardPage for page navigation
  clickTransferPatientButton() {
    this._clickButton('transfer', this.buttons.transferPatient);

    const dialogBox = '.ngdialog';
    this.I.say(`${LOG_TAG} verify the dialog popped up`);
    this.I.waitForElement(dialogBox, 10);
  }

  clickViewPatientButton() {
    this._clickButton('view', this.buttons.viewPatient);
  }

  clickEditPatientButton() {
    this._clickButton('edit', this.buttons.editPatient);
  }

  clickDeletePatientButton() {
    this._clickButton('delete', this.buttons.deletePatient);
    const deletePatientModal = require('./../windows/deletePatientModal.js');
    deletePatientModal._init();
    deletePatientModal.hasPoppedUp();
    return deletePatientModal;
  }

  _clickButton(buttonName, buttonElement) {
    this.I.say(`${LOG_TAG} Clicking on the ${buttonName} button`);
    this.I.click(buttonElement);
    this.I.waitForInvisible('#overlay', 10);
  }
}

module.exports = ActionsComponent;
