(function () {
  'use strict';

  angular
    .module('clinic')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService,  userService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(loadConfigs)
      .then(loadUser);

    ////////////////

    function loadConfigs() {
      return configurations.load(['patientAttributesConfig', 'addressLevels']);
    }

    function initApp() {
      return appService.initApp('clinical', {'app': true, 'extension' : true, 'service': true });
    }

    function loadUser () {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser).success(function(data) {
        $rootScope.currentUser = data.results[0];
      });
    }
  }

})();
