'use strict';

angular.module('application')
    .factory('adminConfigService', ['$http', function ($http) {
        
        var baseOpenMRSRESTURL = "/openmrs/ws/rest/v1";

        var get = function (query) {
            return $http.get(baseOpenMRSRESTURL + "/systemsetting", {
                method: "GET",
                params: {
                    q: query,
                    v: "full"
                     },
                withCredentials: true
            });
        };

        return {
            get : get
        };
    }]);
