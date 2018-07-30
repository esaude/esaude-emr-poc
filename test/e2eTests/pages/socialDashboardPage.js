const Page = require('./page');

const LOG_TAG = '[SocialDashboardPage]';

/**
 * Represents the social dashboard page
 * and includes functionality that facilitates interacting
 * with the page during tests
 * @extends Page
 */
class SocialDashboardPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '[ng-app="social"]',
        urlPart: '/social/#/dashboard',
      },
      components: ['tabs', 'actions'],
    });

    this.tabs = {
      services: 'a[ui-sref="dashboard.services"]',
      partners: 'a[ui-sref="dashboard.partners"]',
    };
  }
}

module.exports = new SocialDashboardPage();
