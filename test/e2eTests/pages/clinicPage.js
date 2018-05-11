const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="clinic"]',
    inUrl: '/clinic',
  },
  components: ['patientSearch'],
})