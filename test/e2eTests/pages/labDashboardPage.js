const Page = require('./page');

const LOG_TAG = '[LabDashboardPage]';

/**
 * Represents the lab dashboard page
 * and includes functionality that facilitates interacting
 * with the page during tests
 * @extends Page
 */
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
