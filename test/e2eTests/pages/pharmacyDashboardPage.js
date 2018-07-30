const Page = require('./page');

/** Represents the pharmacy dashboard page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="pharmacy"]',
    urlPart: '/pharmacy/#/dashboard',
  },
  components: ['patientSearch', 'checkIn', 'actions'],
});
