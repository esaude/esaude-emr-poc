const Page = require('./page');

const LOG_TAG = '[RegistrationPage]';

class RegistrationPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="registration"]',
        urlPart: '/registration',
      },
      components: ['patientSearch'],
    });

    this.newPatientButton = { css: '#new-patient' };
  }

  clickNewPatienButton() {
    this.I.waitForElement(this.newPatientButton);
    this.I.click(this.newPatientButton);

    this.I.say(`${LOG_TAG} waiting for the register patient page to load`);
    this.I.waitForInvisible('#overlay', 5);
    this.I.wait(1);

    const registerPatientPage = require('./registerPatientPage');
    registerPatientPage._init();
    registerPatientPage.isLoaded();
    return registerPatientPage;
  }
}

module.exports = new RegistrationPage();
