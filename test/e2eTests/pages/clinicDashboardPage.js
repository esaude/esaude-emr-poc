const Page = require('./page');

const LOG_TAG = '[ClinicDashboardPage]';

class ClinicDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="clinic"]',
        urlPart: '/clinic/#/dashboard',
      },

      components: ['tabs']
    });

    this.tabs = {
      consultation: 'a[ui-sref="dashboard.consultation"]',
    };
  }

  clickConsultationTab() {
    this.clickTab(this.tabs.consultation)
  }

  clickAddVitals() {
    const vitalsServiceId = '003';
    const addButton = `[data-qa-service-id="${vitalsServiceId}"] button[data-qa-type="add"]`;
    
    this.I.say(`${LOG_TAG} Click the add button`);
    this.I.waitForElement(addButton, 5);
    this.I.click(addButton);

    this.I.say(`${LOG_TAG} waiting for adult vitals form to load`);
    this.I.wait(1);

    const vitalsAdultFormPage = require('./vitalsAdultFormPage');
    vitalsAdultFormPage._init();
    vitalsAdultFormPage.isLoaded();
    return vitalsAdultFormPage;
  }
}

module.exports = new ClinicDashboardPage();
