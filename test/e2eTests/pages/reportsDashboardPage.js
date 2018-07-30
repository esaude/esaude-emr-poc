const Page = require('./page');

/** Represents the reports dashboard page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="reports"]',
    urlPart: '/reports/#/dashboard',
  },
});
