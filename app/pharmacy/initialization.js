(function () {
  'use strict';

  angular
    .module('pharmacy')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization($cookies, $rootScope, authenticator, appService,  userService, sessionService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs)
      .then(loadUser)
      .then(initDrugMapping)
      .then(loadProvider);

    ////////////////

    function getConfigs() {
      $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
      $rootScope.appId = appService.getAppDescriptor().getId();
    }

    function  initDrugMapping() {
      $rootScope.drugMapping = appService.getAppDescriptor().getDrugMapping()[0];
    }

    function initApp() {
      return appService.initApp('pharmacy', {'app': true, 'extension' : true, 'service': true });
    }

    function  loadUser() {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser).success(function(data) {
        $rootScope.currentUser = data.results[0];
      });
    }

    function  loadProvider() {
      return sessionService.loadProviders($rootScope.currentUser).success(function (data) {
        var providerUuid = (data.results.length > 0) ? data.results[0].uuid : undefined;
        $rootScope.currentProvider = {uuid: providerUuid};
      });
    }
  }

})();
