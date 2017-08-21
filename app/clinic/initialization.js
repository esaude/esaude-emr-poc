'use strict';

angular.module('clinic').factory('initialization',
    ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'userService', 'formLoader', 'sessionService',
    function ($cookies, $rootScope, configurations, authenticator, appService, spinner, userService, formLoader, sessionService) {
        var getConfigs = function () {
            var configNames = ['patientAttributesConfig', 'addressLevels'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
                $rootScope.landingPageAfterSearch = appService.getAppDescriptor().getConfigValue("landingPageAfterSearch");
                $rootScope.landingPageAfterSave = appService.getAppDescriptor().getConfigValue("landingPageAfterSave");
                $rootScope.defaultVisitTypes = appService.getAppDescriptor().getConfigValue("defaultVisitTypes");
                $rootScope.addressLevels = configurations.addressLevels();
                $rootScope.defaultDisplayLimit = appService.getAppDescriptor().getConfigValue("defaultDisplayLimit");
                $rootScope.appId = appService.getAppDescriptor().getId();
            });
        };

        var initForms = function () {
           return formLoader.load(appService.getAppDescriptor().getClinicalServices()).then(function (data) {
               $rootScope.serviceForms = data;
           });
        };

        var initClinicalServices = function () {
            $rootScope.clinicalServices = appService.getAppDescriptor().getClinicalServices();
        };

        var initFormLayout = function () {
            $rootScope.formLayout = appService.getAppDescriptor().getFormLayout();
        };

        var initDrugMapping = function () {
            $rootScope.drugMapping = appService.getAppDescriptor().getDrugMapping()[0];
        };

        var initApp = function() {
            return appService.initApp('clinical', {'app': true, 'extension' : true, 'service': true });
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
        }

        return spinner.forPromise(authenticator.authenticateUser()
                .then(initApp)
                .then(getConfigs)
                .then(loadUser)
                .then(initFormLayout)
                .then(initForms)
                .then(initClinicalServices)
                .then(initDrugMapping)
                .then(loadProvider));
    }]
);
