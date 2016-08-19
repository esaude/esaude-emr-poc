'use strict';

angular.module('home')
    .factory('initialization', ['spinner', 'appService', '$q',
        function (spinner, appService, $q) {

            var initApp = function() {
                var deferred = $q.defer();
                appService.initApp('home', {'app': true, 'extension' : true, 'service': false });
                deferred.resolve();
                return deferred.promise;
            };
            return spinner.forPromise(initApp());
        }
    ]);
