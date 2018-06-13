const Page = require('./page')

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="registration"]',
    urlPart: '/registration',
  },
  components: ['patientSearch'],
})