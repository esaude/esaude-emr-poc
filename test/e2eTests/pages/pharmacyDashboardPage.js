const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="pharmacy"]',
    urlPart: '/pharmacy/#/dashboard',
  },
  components: ['patientSearch', 'checkIn'],
});
