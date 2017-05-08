'use strict';

angular.module('bahmni.common.config')
    .service('configurations', ['configurationService', function (configurationService) {

        this.configs = {};

        this.load = function (configNames) {
            var self = this;
            return configurationService.getConfigurations(_.difference(configNames, Object.keys(this.configs))).then(function (configurations) {
                angular.extend(self.configs, configurations);
            });
        };


        this.patientAttributesConfig = function() {
            return this.configs.patientAttributesConfig.results;
        };
        
        this.defaultLocation = function() {
            return this.configs.defaultLocation.results[0] || [];
        };

        this.addressLevels = function() {
            return this.configs.addressLevels;
        };
    }]);
