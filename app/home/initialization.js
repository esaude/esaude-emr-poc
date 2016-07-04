'use strict';

angular.module('home')
    .factory('initialization', ['$rootScope', 'locationService', 'spinner', 'esaudeConfigurations', 'appService',
        function ($rootScope, locationService, spinner, configurations, appService) {

            var initApp = function() {
                return appService.initApp('home', {'app': true, 'extension' : true, 'service': false });
            };
            return spinner.forPromise(initApp().then(configurations.loadDefaultLocation()));
        }
    ]);
