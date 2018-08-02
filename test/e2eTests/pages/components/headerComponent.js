const Component = require('./component');

const LOG_TAG = '[HeaderComponent]';

/**
 * Functions that help interact with the main header
 * @extends Component
 */
class HeaderComponent extends Component {
  constructor() {
    super();

    this.dropdown = {
      hamburgerButton: { css: '.dropdown-toggle' },
      logoutButton: { css: 'a[log-out]' },
    };

    this.homeLink = '#home-link';
  }

  /** Clicks the home button */
  clickHome() {
    this.I.waitForElement(this.homeLink);

    this.I.say(`${LOG_TAG} Clicking on the home button`);
    this.I.click(this.homeLink);

    this.I.wait(1);

    this.I.say(`${LOG_TAG} Clicking on the confirm button`);
    this.I.click('SIM');

    const dashboardPage = require('./../dashboardPage');
    dashboardPage._init();
    dashboardPage.isLoaded();
    return dashboardPage;
  }

  /**
   * Verifies the success toast popped up
   * @param {string} message - the expected toast message. Default is 'COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'
   */
  verifySuccessToast(message = 'COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED') {
    this.I.say(`${LOG_TAG} verify the success toast popped up`);
    const successElement = '.toast-success';
    this.I.waitForElement(successElement, 10);
    this.I.see(this.translate(message), successElement);
    this.I.wait(3);
  }

  /** Logs the user out */
  logout() {
    // WaitForElement doesn't seem to work, so waiting for an arbitrary
    // amount of time for the hamburger button to appear
    this.I.wait(3);

    this.I.say(`${LOG_TAG} Clicking on the logout`);
    this.I.click(this.dropdown.hamburgerButton);
    this.I.click(this.dropdown.logoutButton);

    // Helps the caller detect whether logout was
    // successful or not
    return {
      // If logout was successful we should be taken to the home page
      successful() {
        const loginPage = require('./../loginPage');
        loginPage._init();
        loginPage.isLoaded();
        return loginPage;
      },
    };
  }
}

module.exports = HeaderComponent;
