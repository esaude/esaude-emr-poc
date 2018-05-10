// Properties defined in the actor below are added
// to the instance of "I" used during tests

'use strict';

module.exports = function() {
  return actor({

    // Log the user in
    login: function(userInfo) {
      // Default to the admin user
      if(!userInfo) {
        userInfo = require('./data.js').users.admin
      }

      // Create the login page object
      const loginPage = require('./pages/loginPage')
      loginPage._init()

      // Login and return the dashboard page
      const loginStatus = loginPage.login(userInfo)
      const dashboardPage = loginStatus.successful()
      return dashboardPage
    },

  });
}
