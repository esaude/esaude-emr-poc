(function () {
  'use strict';

  angular
    .module('lab')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService',  'userService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(loadConfigs);

    ////////////////

    function loadConfigs() {
      return configurations.load(['patientAttributesConfig', 'addressLevels']);
    }

    function initApp() {
      return appService.initApp('lab', {'app': true, 'extension': true, 'service': true});
    }
  }

})();
