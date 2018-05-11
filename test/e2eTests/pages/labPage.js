const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="lab"]',
    inUrl: '/lab',
  },
  components: ['patientSearch'],
})