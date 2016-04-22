'use strict';

angular.module('home')
    .factory('initialization', ['$rootScope', 'locationService', 'spinner', 'configurations', 'appService',
        function ($rootScope, locationService, spinner, configurations, appService) {

            var getConfigs = function () {
                var configNames = ['defaultLocation'];
                return configurations.load(configNames).then(function () {
                    var defaultLocation = configurations.defaultLocation().value;
                    locationService.get(defaultLocation).then(function (data) {
                        $rootScope.location = data.data.results[0]
                    });
                });
            };

            var initApp = function() {
                return appService.initApp('home', {'app': true, 'extension' : true, 'service': false });
            };
            return spinner.forPromise(initApp().then(getConfigs()));
        }
    ]);
