const Page = require('./page');

class LoginPage extends Page {

  constructor() {
    super({
      isLoaded: {
        element: '#username',
        urlPart: '/login',
      },
    });

    this.fields = {
      username: '#username',
      password: '#password'
    };

    this.loginButton = {css: '.btn'};
  }

  // Logs the user in
  login(userInfo) {
    this.I.amOnPage('/home/index.html#/login')
    this.I.selectOption('#locale', 'Português');
    this.I.fillField(this.fields.username, userInfo.username);
    this.I.fillField(this.fields.password, userInfo.password);
    this.I.click(this.loginButton);

    // Wait for the page to load
    this.I.waitForInvisible('#overlay', 5);

    const I = this.I;

    // Helps the caller detect whether login was
    // successful or not
    return {
      // If login was successful we should be taken to the dashboard
      successful() {
        const dashboardPage = require('./dashboardPage');
        dashboardPage._init();
        dashboardPage.isLoaded();
        return dashboardPage;
      },

      // If the login was unsuccessful an error should pop up
      unsuccessful(errorMessage) {
        I.see(errorMessage);
      },
    };
  }
}

module.exports = new LoginPage();
