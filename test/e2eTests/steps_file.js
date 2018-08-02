'use strict';

/** Extends properties on the I variable during tests */
module.exports = function() {
  return actor({

    /**
     * Logs the user in through the login page.
     * If no user is specified the admin user is used.
     * @param {object} - information about the user that's used to login
     */
    login: function(userInfo) {
      // Default to the admin user
      if(!userInfo) {
        userInfo = require('./data.js').users.admin;
      }

      // Create the login page object
      const loginPage = require('./pages/loginPage');
      loginPage._init();

      // Login and return the dashboard page
      const loginStatus = loginPage.login(userInfo);
      const dashboardPage = loginStatus.successful();
      return dashboardPage;
    },
  });
};
