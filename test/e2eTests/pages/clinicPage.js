const Page = require('./page');

/** Represents the clinic page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="clinic"]',
    urlPart: '/clinic',
  },
  components: ['patientSearch'],
});
