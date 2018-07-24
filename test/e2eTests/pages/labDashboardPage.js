const Page = require('./page');

const LOG_TAG = '[LabDashboardPage]';

class LabDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="lab"]',
        urlPart: '/lab/#/dashboard',
      },
      components: ['tabs', 'actions'],
    });

    this.tabs = {
      testorders: 'a[ui-sref="dashboard.testorders"]',
      testrequest: 'a[ui-sref="dashboard.testrequest"]',
    };
  }
}

module.exports = new LabDashboardPage();
