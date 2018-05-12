const Page = require('./page')

module.exports = new Page({
  isLoaded: {
    element: '[ng-app="lab"]',
    urlPart: '/lab',
  },
  components: ['patientSearch'],
})