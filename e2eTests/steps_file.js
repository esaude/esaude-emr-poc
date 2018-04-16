
'use strict';

module.exports = function() {
  return actor({

    // Log the user in
    login: function(userInfo) {
      // Create the login page object
      const loginPage = require('./pages/loginPage')
      loginPage._init()

      // Login and return an object that helps callers
      // check login status
      return loginPage.login(userInfo.username, userInfo.password)
    },

  });
}
