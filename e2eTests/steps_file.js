
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

      // Login and return an object that helps callers
      // check login status
      return loginPage.login(userInfo.username, userInfo.password)
    },

  });
}
