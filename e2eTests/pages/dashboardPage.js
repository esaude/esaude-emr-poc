'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  buttons: {
    registration: {css: '#registration'},
    social: {css: '#social'},
    vitals: {css: '#vitals'},
    clinic: {css: '#clinic'},
    pharmacy: {css: '#pharmacy'},
    lab: {css: '#lab'},
    report: {css: '#report'},
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
    // WaitForElement doesn't seem to work, so waiting for an arbitrary
    // amount of time for the hamburger button to appear
    I.wait(3)

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

  navigateToRegistrationPage() {
    return this._navigate(this.buttons.registration, './registrationPage.js')
  },

  _navigate(button, newPageFile) {
    I.waitForElement(button.css, 5)
    I.wait(1)
    I.click(button)

    const page = require(newPageFile)
    page._init()
    page.isLoaded()
    return page
  },
}