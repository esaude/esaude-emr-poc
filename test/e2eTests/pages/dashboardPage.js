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

  // Validates that the page is loaded
  isLoaded() {
    I.waitForElement(this.homeLink, 5)
    I.seeInCurrentUrl('/dashboard')
  },

  // Logs the user out
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

  // Navigates to the registration page
  navigateToRegistrationPage() {
    return this._navigate(this.buttons.registration, './registrationPage.js')
  },

  // Navigates to an app by clicking the app's button
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