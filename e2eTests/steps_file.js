
'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    login: function(userInfo) {
      this.amOnPage('/index.html#/login')
      this.fillField('#username', userInfo.username)
      this.fillField('#password', userInfo.password)
      this.click('.btn')
    },

  });
}
