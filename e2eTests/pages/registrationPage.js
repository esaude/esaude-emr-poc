'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  registrationApp: '[ng-app="registration"]',
  searchBox: 'input[ng-model="vm.searchText"',

  isLoaded() {
    I.waitForElement(this.registrationApp, 5)
    I.seeInCurrentUrl('/registration')
  },

  search(text) {
    I.waitForElement(this.searchBox)
    
    // This selects the element
    I.fillField(this.searchBox, text)

    const registrationDashboardPage = require('./registrationDashboardPage')
    registrationDashboardPage._init()

    I.wait(1)
    registrationDashboardPage.isLoaded()

    return registrationDashboardPage
  }
}