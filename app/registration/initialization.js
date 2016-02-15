'use strict';

angular.module('registration').factory('initialization',
    ['$q', '$cookieStore', '$rootScope', 'configurations', 'authenticator', 'appService', 'spinner', 'Preferences', 'applicationService', 'userService',
    function ($q, $cookieStore, $rootScope, configurations, authenticator, appService, spinner, preferences, applicationService, userService) {
        var getConfigs = function() {
            var configNames = ['encounterConfig', 'patientAttributesConfig', 'identifierSourceConfig', 'addressLevels', 'genderMap', 'relationshipTypeConfig'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Bahmni.Registration.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.regEncounterConfiguration = angular.extend(new Bahmni.Registration.RegistrationEncounterConfig(), configurations.encounterConfig());
                $rootScope.encounterConfig = angular.extend(new EncounterConfig(), configurations.encounterConfig());
                $rootScope.patientConfiguration = new Bahmni.Registration.PatientConfig(patientAttributeTypes.personAttributeTypes, configurations.identifierSourceConfig(), appService.getAppDescriptor().getConfigValue("additionalPatientInformation"));

                $rootScope.addressLevels = configurations.addressLevels();
                $rootScope.fieldValidation = appService.getAppDescriptor().getConfigValue("fieldValidation");
                $rootScope.genderMap = configurations.genderMap();
                $rootScope.relationshipTypes = configurations.relationshipTypes();
            });
        };

        var loadValidators = function (baseUrl,contextPath) {
                Bahmni.Common.Util.DynamicResourceLoader.includeJs(baseUrl + contextPath + '/fieldValidation.js');
        };

        var initApp = function() {
            return appService.initApp('registration', {'app': true, 'extension' : true });
        };

        var getIdentifierPrefix = function() {
            preferences.identifierPrefix = appService.getAppDescriptor().getConfigValue("defaultIdentifierPrefix");
        };

        var initAppConfigs = function(){
            $rootScope.registration = $rootScope.registration ||{};
            getIdentifierPrefix();
        };

        var mapRelationsTypeWithSearch = function() {
            var relationshipTypeMap = appService.getAppDescriptor().getConfigValue("relationshipTypeMap") || {};
            $rootScope.relationshipTypes.forEach(function(relationshipType) {
                relationshipType.searchType = relationshipTypeMap[relationshipType.aIsToB] || "patient";
            });
        };
        
        var initAppConfig = function () {
            applicationService.getApps().then(function (appJson) {
                $rootScope.forms = eval(appJson.forms);
            });
        };
        
        var loadProvider = function () {
            var deferrable = $q.defer();
            
            var currentUser = $cookieStore.get(Bahmni.Common.Constants.currentUser);
            
            userService.getUser(currentUser).success(function(data) {
                userService.getProviderForUser(data.results[0].uuid).success(function(providers) {
                    var providerUuid = (providers.results.length > 0) ? providers.results[0].uuid : undefined;
                    $rootScope.currentProvider = { uuid: providerUuid };
                    $rootScope.currentUser = data.results[0];
                    deferrable.resolve(data.results[0]);
                });
            });
        };

        return spinner.forPromise(authenticator.authenticateUser().then(initApp).then(getConfigs).then(initAppConfigs)
            .then(mapRelationsTypeWithSearch)
            .then(loadValidators(appService.configBaseUrl(), "registration"))
            .then(initAppConfig)
            .then(loadProvider));
    }]
);