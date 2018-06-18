const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: '[ui-sref="dashboard.program"]',
    urlPart: '/registration/#/dashboard',
  },
  components: ['patientSearch', 'checkIn'],
});
