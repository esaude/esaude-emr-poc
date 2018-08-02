const Page = require('./page');

/** Represents the vitals dashbaord page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="vitals"]',
    urlPart: '/vitals/#/dashboard',
  },
  components: ['actions'],
});
