const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="vitals"]',
    inUrl: '/vitals',
  },
  components: ['patientSearch'],
})