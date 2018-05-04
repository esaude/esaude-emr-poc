'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  registrationApp: '[ng-app="registration"]',
  searchBox: 'input[ng-model="vm.searchText"',

  // Validates that the page is loaded
  isLoaded() {
    I.waitForElement(this.registrationApp, 5)
    I.seeInCurrentUrl('/registration')
  },

  // Searches in the registration search box
  search(text) {
    I.waitForElement(this.searchBox)
    
    // This selects the element for some reason
    // That behavior seems like a bug in codeceptjs
    // We should have to send enter or something, right?
    I.fillField(this.searchBox, text)

    // The browser should have been navigated to the registration dashboard page
    const registrationDashboardPage = require('./registrationDashboardPage')
    registrationDashboardPage._init()

    // Give the browser a second to load
    // then validate we're on the registration dashboard page
    I.wait(1)
    registrationDashboardPage.isLoaded()

    return registrationDashboardPage
  }
}