(() => {
  'use strict';

  angular
    .module('social')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization($cookies, $rootScope, authenticator, appService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs);

    ////////////////

    function getConfigs() {
      $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
      $rootScope.appId = appService.getAppDescriptor().getId();
    }

    function initApp() {
      return appService.initApp('social', {'app': true, 'extension': true, 'service': true});
    }
  }

})();
