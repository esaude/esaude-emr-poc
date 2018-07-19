const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="social"]',
    urlPart: '/social/#/dashboard',
  },
  components: ['actions'],
});
