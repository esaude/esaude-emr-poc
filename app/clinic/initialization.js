(function () {
  'use strict';

  angular
    .module('clinic')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService',  'userService', 'sessionService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService,  userService, sessionService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(loadConfigs)
      .then(getConfigs)
      .then(loadUser)
      .then(initDrugMapping)
      .then(loadProvider);

    ////////////////

    function loadConfigs() {
      return configurations.load(['patientAttributesConfig', 'addressLevels']);
    }

    function getConfigs() {
      $rootScope.defaultDisplayLimit = appService.getAppDescriptor().getConfigValue("defaultDisplayLimit");
      $rootScope.appId = appService.getAppDescriptor().getId();
    }

    function initDrugMapping() {
      $rootScope.drugMapping = appService.getAppDescriptor().getDrugMapping()[0];
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

    function loadProvider () {
      return sessionService.loadProviders($rootScope.currentUser).success(function (data) {
        var providerUuid = (data.results.length > 0) ? data.results[0].uuid : undefined;
        $rootScope.currentProvider = {uuid: providerUuid};
      });
    }
  }

})();
