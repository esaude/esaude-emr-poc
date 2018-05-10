'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  fields: {
    username: '#username',
    password: '#password'
  },

  loginButton: {css: '.btn'},

  // Validates that the page is loaded
  isLoaded() {
    I.waitForElement(this.fields.username, 5)
    I.seeInCurrentUrl('/login')
  },

  // Logs the user in
  login(userInfo) {
    I.amOnPage('/home/index.html#/login')
    I.fillField(this.fields.username, userInfo.username);
    I.fillField(this.fields.password, userInfo.password);
    I.click(this.loginButton);

    // Wait for the page to load
    I.wait(1)

    // Helps the caller detect whether login was
    // successful or not
    return {
      // If login was successful we should be taken to the dashboard
      successful() {
        const dashboardPage = require('./dashboardPage')
        dashboardPage.isLoaded()
        return dashboardPage
      },

      // If the login was unsuccessful an error should pop up
      unsuccessful(errorMessage) {
        I.see(errorMessage)
      },
    }
  },
}