'use strict';
 angular.module('bahmni.common.config')
    .service('esaudeConfigurations', ['$rootScope', 'configurations', 'locationService', function ($rootScope, configurations, locationService) {

      this.loadDefaultLocation = function () {
        var configNames = ['defaultLocation'];
        return configurations.load(configNames).then(function () {
          var defaultLocation = configurations.defaultLocation().value;
          locationService.get(defaultLocation).then(function (data) {
            $rootScope.location = data.data.results[0];
          });
        });
      };
  }]);
