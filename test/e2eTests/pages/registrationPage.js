const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ng-app="registration"]',
    inUrl: '/registration',
  },
  components: ['patientSearch'],
})