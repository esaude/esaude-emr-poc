(function () {
  'use strict';

  angular
    .module('registration')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService',  'userService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService,  userService) {

    return authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs)
      .then(loadUser);

    ////////////////

    function getConfigs() {
      var configNames = ['patientAttributesConfig', 'addressLevels'];
      return configurations.load(configNames).then(function () {
        var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
        var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
        $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
        $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
        $rootScope.defaultVisitTypes = appService.getAppDescriptor().getConfigValue("defaultVisitTypes");
        $rootScope.appId = appService.getAppDescriptor().getId();
      });
    }

    function initApp() {
      return appService.initApp('registration', {'app': true, 'extension': true, 'service': true});
    }

    function loadUser() {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser).success(function (data) {
        $rootScope.currentUser = data.results[0];
      });
    }
  }

})();
