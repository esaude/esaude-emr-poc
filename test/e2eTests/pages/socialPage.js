const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="social"]',
    inUrl: '/social',
  },
  components: ['patientSearch'],
})