'use strict';

angular.module('vitals').factory('initialization',
    ['$cookies', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'userService', 'formLoader',
    function ($cookies, $rootScope, configurations, authenticator, appService, spinner, userService, formLoader) {
        var getConfigs = function () {
            var configNames = ['patientAttributesConfig', 'addressLevels'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, configurations.identifierSourceConfig(), appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
                $rootScope.addressLevels = configurations.addressLevels();
                $rootScope.encounterTypes = appService.getAppDescriptor().getConfigValue("encounterTypes");
            });
        };
        
        var initForms = function () {
           formLoader.load(_.map(appService.getAppDescriptor().getClinicalServices(), "formId")).then(function (data) {
               $rootScope.serviceForms = data;
           });
        };
        
        var initClinicalServices = function () {
            $rootScope.clinicalServices = appService.getAppDescriptor().getClinicalServices();
        };
        
        var initFormLayout = function () {
            $rootScope.formLayout = appService.getAppDescriptor().getFormLayout();
        };

        var initApp = function() {
            return appService.initApp('vitals', {'app': true, 'extension' : true, 'service': true });
        };
        
        var loadUser = function () {       
            var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);
            
            userService.getUser(currentUser).success(function(data) {
                $rootScope.currentUser = data.results[0];
            });
        };

        return spinner.forPromise(authenticator.authenticateUser()
                .then(initApp)
                .then(getConfigs)
                .then(loadUser)
                .then(initFormLayout)
                .then(initForms)
                .then(initClinicalServices));
    }]
);