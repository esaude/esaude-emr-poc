const Page = require('./page');

/** Represents the social dashboard page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="social"]',
    urlPart: '/social/#/dashboard',
  },
  components: ['actions'],
});
