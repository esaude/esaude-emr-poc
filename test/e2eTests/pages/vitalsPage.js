const Page = require('./page');

/** Represents the vitals page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="vitals"]',
    urlPart: '/vitals',
  },
  components: ['patientSearch'],
});
