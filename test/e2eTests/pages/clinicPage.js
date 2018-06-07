const Page = require('./page')

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="clinic"]',
    urlPart: '/clinic',
  },
  components: ['patientSearch'],
})