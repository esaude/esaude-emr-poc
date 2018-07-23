const Page = require('./page');

module.exports = new Page({
  isLoaded: {
    element: 'patient-details',
    urlPart: '/patient/detail',
  },
});
