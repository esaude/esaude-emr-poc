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

  // Logs the user in
  login(username, password) {
    I.amOnPage('/index.html#/login')
    I.fillField(this.fields.username, username);
    I.fillField(this.fields.password, password);
    I.click(this.loginButton);

    // Helps the caller detect whether login was
    // successful or not
    return {
      // If login was successful we should be taken to the dashboard
      successful() {
        I.waitForElement('#home-link', 5)
      },

      // If the login was unsuccessful an error should pop up
      unsuccessful() {
        I.waitForElement('div[ng-show="vm.errorMessageTranslateKey"]', 5)
      },
    }
  },
}