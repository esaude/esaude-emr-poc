'use strict';

angular.module('clinic').factory('initialization',
    ['$cookieStore', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'userService', 'formLoader',
    function ($cookieStore, $rootScope, configurations, authenticator, appService, spinner, userService, formLoader) {
        var getConfigs = function () {
            var configNames = ['patientAttributesConfig', 'addressLevels'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.patientConfiguration = new Poc.Patient.PatientConfig(patientAttributeTypes.personAttributeTypes, configurations.identifierSourceConfig(), appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));
                $rootScope.addressLevels = configurations.addressLevels();
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
            return appService.initApp('clinical', {'app': true, 'extension' : true });
        };
        
        var loadUser = function () {       
            var currentUser = $cookieStore.get(Bahmni.Common.Constants.currentUser);
            
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