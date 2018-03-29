(function () {
  'use strict';

  angular
    .module('clinic')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'userService', 'sessionService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService, spinner, userService, sessionService) {

    return spinner.forPromise(authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs)
      .then(loadUser)
      .then(initDrugMapping)
      .then(loadProvider));

    ////////////////

    function getConfigs() {
      var configNames = ['patientAttributesConfig', 'addressLevels'];
      return configurations.load(configNames).then(function () {
        var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
        var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
        $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
        $rootScope.defaultVisitTypes = appService.getAppDescriptor().getConfigValue("defaultVisitTypes");
        $rootScope.defaultDisplayLimit = appService.getAppDescriptor().getConfigValue("defaultDisplayLimit");
        $rootScope.additionalPatientAttributes = appService.getAppDescriptor().getConfigValue("additionalPatientAttributes");
        $rootScope.appId = appService.getAppDescriptor().getId();
      });
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
