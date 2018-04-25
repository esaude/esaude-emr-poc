'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  dropdown: {
    hamburgerButton: {css: '.dropdown-toggle'},
    logoutButton: {css: 'a[log-out]'},
  },

  homeLink: '#home-link',

  isLoaded() {
    I.waitForElement(this.homeLink, 5)
    I.seeInCurrentUrl('/dashboard')
  },

  // Logs the user in
  logout() {
    I.wait(1)
    I.click(this.dropdown.hamburgerButton)
    I.click(this.dropdown.logoutButton)

    // Helps the caller detect whether logout was
    // successful or not
    return {
      // If logout was successful we should be taken to the home page
      successful() {
        const loginPage = require('./loginPage')
        loginPage.isLoaded()
        return loginPage
      },
    }
  },
}