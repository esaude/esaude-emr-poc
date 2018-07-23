const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="vitals"]',
    urlPart: '/vitals/#/dashboard',
  },
  components: ['actions'],
});
