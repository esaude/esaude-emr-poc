'use strict';

let I;

module.exports = {

  _init() {
    I = actor();
  },

  programsTab: '[ui-sref="dashboard.program"]',

  // Validates that the page is loaded
  isLoaded() {
    I.waitForElement(this.programsTab, 5)
    I.seeInCurrentUrl('/registration/#/dashboard')
  },
}