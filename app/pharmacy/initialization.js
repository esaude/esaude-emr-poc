'use strict';

angular.module('pharmacy').factory('initialization',
    ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService',  'userService', 'sessionService',
    function ($cookies, $rootScope, configurations, authenticator, appService,  userService, sessionService) {
        var getConfigs = function () {
            var configNames = ['patientAttributesConfig', 'addressLevels'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
                $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
                $rootScope.appId = appService.getAppDescriptor().getId();
            });
        };

        var initDrugMapping = function () {
            $rootScope.drugMapping = appService.getAppDescriptor().getDrugMapping()[0];
        };

        var initApp = function() {
            return appService.initApp('pharmacy', {'app': true, 'extension' : true, 'service': true });
        };

        var loadUser = function () {
            var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

            return userService.getUser(currentUser).success(function(data) {
                $rootScope.currentUser = data.results[0];
            });
        };

        var loadProvider = function () {
          return sessionService.loadProviders($rootScope.currentUser).success(function (data) {
            var providerUuid = (data.results.length > 0) ? data.results[0].uuid : undefined;
            $rootScope.currentProvider = {uuid: providerUuid};
          });
        };

        return authenticator.authenticateUser()
                .then(initApp)
                .then(getConfigs)
                .then(loadUser)
                .then(initDrugMapping)
                .then(loadProvider);
    }]
);
