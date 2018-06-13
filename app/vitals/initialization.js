(function () {
  'use strict';

  angular
    .module('vitals')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'authenticator', 'appService',  'userService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, authenticator, appService,  userService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs)
      .then(loadUser);

    ////////////////

    function getConfigs() {
      $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
      $rootScope.appId = appService.getAppDescriptor().getId();
    }

    function initApp() {
      return appService.initApp('vitals', {'app': true, 'extension': true, 'service': true});
    }

    function loadUser() {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser).success(function (data) {
        $rootScope.currentUser = data.results[0];
      });
    }
  }

})();
