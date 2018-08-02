const Page = require('./page');

/** Represents the edit patient page */
module.exports = new Page({
  isLoaded: {
    element: '[ng-app="registration"]',
    urlPart: '/patient/edit/',
  },
});
