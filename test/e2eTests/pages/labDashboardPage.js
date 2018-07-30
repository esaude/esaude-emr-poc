const Page = require('./page');

/** Represents the lab dashboard page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="lab"]',
    urlPart: '/lab/#/dashboard',
  },
  components: ['actions'],
});
