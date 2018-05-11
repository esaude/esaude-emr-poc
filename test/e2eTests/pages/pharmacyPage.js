const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="pharmacy"]',
    inUrl: '/pharmacy',
  },
  components: ['patientSearch'],
})