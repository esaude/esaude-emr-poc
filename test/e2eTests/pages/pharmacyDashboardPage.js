const Page = require('./page');

const LOG_TAG = '[PharmacyDashboardPage]';

class PharmacyDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="pharmacy"]',
        urlPart: '/pharmacy/#/dashboard',
      },
      components: ['patientSearch', 'checkIn', 'tabs', 'actions'],
    });

    this.tabs = {
      prescriptions: 'a[ui-sref="dashboard.prescriptions"]',
      filaHistory: 'a[ui-sref="dashboard.filaHistory"]',
      dispensationHistory: 'a[ui-sref="dashboard.dispensationHistory"]',
      dispensation: 'a[ui-sref="dashboard.dispensation"]',
    };
  }
}

module.exports = new PharmacyDashboardPage();
