'use strict';

angular.module('home')
    .factory('initialization', ['$rootScope', 'locationService', 'spinner', 'configurations',
        function ($rootScope, locationService, spinner, configurations) {
            
            var getConfigs = function () {
                var configNames = ['defaultLocation'];
                return configurations.load(configNames).then(function () {
                    var defaultLocation = configurations.defaultLocation().value;
                    locationService.get(defaultLocation).success(function (data) {
                        $rootScope.location = data.results[0]
                    });
            });
        };

            return spinner.forPromise(getConfigs());
        }
    ]);