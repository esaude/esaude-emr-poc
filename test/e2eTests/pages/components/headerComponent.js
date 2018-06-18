const Component = require('./component');

const LOG_TAG = '[HeaderComponent]';

class HeaderComponent extends Component {
  constructor() {
    super();

    this.dropdown = {
      hamburgerButton: {css: '.dropdown-toggle'},
      logoutButton: {css: 'a[log-out]'},
    };

    this.homeLink = '#home-link';
  }

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

  // Logs the user out
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
