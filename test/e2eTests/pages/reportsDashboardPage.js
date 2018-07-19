const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="reports"]',
    urlPart: '/reports/#/dashboard',
  },
});
