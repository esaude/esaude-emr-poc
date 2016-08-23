'use strict';

angular.module('home')
    .factory('initialization', ['spinner', 'appService',
        function (spinner, appService) {

            var initApp = function() {
                return appService.initApp('home', {'app': true, 'extension' : true, 'service': false })
            };
            return spinner.forPromise(initApp());
        }
    ]);
