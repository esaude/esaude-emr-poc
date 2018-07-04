(() => {
  'use strict';

  angular
    .module('clinic')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization($cookies, $rootScope, authenticator, appService,  userService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(loadUser);

    ////////////////

    function initApp() {
      return appService.initApp('clinic', {'app': true, 'extension' : true, 'service': true });
    }

    function loadUser () {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser).success(data => {
        $rootScope.currentUser = data.results[0];
      });
    }
  }

})();
