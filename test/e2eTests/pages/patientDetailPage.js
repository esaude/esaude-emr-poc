const Page = require('./page');

/** Represents the patient detail page */
module.exports = new Page({
  isLoaded: {
    element: 'patient-details',
    urlPart: '/patient/detail',
  },
});
