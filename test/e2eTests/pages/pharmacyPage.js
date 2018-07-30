const Page = require('./page');

/** Represents the pharmacy page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="pharmacy"]',
    urlPart: '/pharmacy',
  },
  components: ['patientSearch'],
});
