'use strict';

angular.module('registration').factory('initialization',
    ['$q', '$cookieStore', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'Preferences', 'applicationService', 'userService', 'formLoader',
    function ($q, $cookieStore, $rootScope, configurations, authenticator, appService, spinner, preferences, applicationService, userService, formLoader) {
        var getConfigs = function () {
            var configNames = ['patientAttributesConfig', 'addressLevels', 'genderMap'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Bahmni.Registration.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.patientConfiguration = new Bahmni.Registration.PatientConfig(patientAttributeTypes.personAttributeTypes, configurations.identifierSourceConfig(), appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));

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
            return appService.initApp('registration', {'app': true, 'extension' : true });
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