'use strict';

angular.module('home')
    .factory('loginInitialization', ['$q', 'locationService', 'spinner',
        function ($q, locationService, spinner) {
            var init = function () {
                var deferrable = $q.defer();
                locationService.getAllByTag("Login Location").then(
                    function(response) {deferrable.resolve({locations: response.data.results})},
                    function() {deferrable.reject()}
                );
                return deferrable.promise;
            };

            return spinner.forPromise(init());
        }
    ]);