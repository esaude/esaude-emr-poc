'use strict';

angular.module('authentication', []).factory('authenticate',
    ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {
        
        return function() {
            var deferred = $q.defer();
            if ($rootScope.currentUser != null) {
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/login');
            }
            return deferred.promise;
        };
    }]
);
