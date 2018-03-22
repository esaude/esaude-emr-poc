(function () {
  'use strict';

  angular
    .module('lab')
    .factory('initialization', initialization);

  initialization.$inject = ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'userService'];

  /* @ngInject */
  function initialization($cookies, $rootScope, configurations, authenticator, appService, spinner) {

    return spinner.forPromise(authenticator.authenticateUser()
      .then(initApp)
      .then(getConfigs));

    ////////////////

    function getConfigs() {
      var configNames = ['patientAttributesConfig', 'addressLevels'];
      return configurations.load(configNames).then(function () {
        var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
        var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper()
          .mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);

        $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes,
          appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
      });
    }

    function initApp() {
      return appService.initApp('lab', {'app': true, 'extension': true, 'service': true});
    }
  }

})();