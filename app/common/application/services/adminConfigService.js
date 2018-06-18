'use strict';

angular.module('application')
    .factory('adminConfigService', ['$http', $http => {

        var baseOpenMRSRESTURL = "/openmrs/ws/rest/v1";

        var get = query => $http.get(baseOpenMRSRESTURL + "/systemsetting", {
          method: "GET",
          params: {
            q: query,
            v: "full"
          },
          withCredentials: true
        });

        return {
            get : get
        };
    }]);
