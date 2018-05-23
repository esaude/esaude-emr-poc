(function () {
  'use strict';

  angular
    .module('social')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(loadConfigs)
      .then(getConfigs);

    ////////////////

    function loadConfigs() {
      return configurations.load(['patientAttributesConfig', 'addressLevels']);
    }

    function getConfigs() {
      $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
      $rootScope.appId = appService.getAppDescriptor().getId();
    }

    function initApp() {
      return appService.initApp('social', {'app': true, 'extension': true, 'service': true});
    }
  }

})();
