const Page = require('./page');

/** Represents the lab page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="lab"]',
    urlPart: '/lab',
  },
  components: ['patientSearch'],
});
