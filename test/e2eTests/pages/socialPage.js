const Page = require('./page');

/** Represents the social page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="social"]',
    urlPart: '/social',
  },
  components: ['patientSearch'],
});
