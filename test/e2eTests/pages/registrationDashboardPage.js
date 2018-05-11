const Page = require('./page')

module.exports = new Page({
  loaded: {
    element: '[ui-sref="dashboard.program"]',
    inUrl: '/registration/#/dashboard',
  },
})