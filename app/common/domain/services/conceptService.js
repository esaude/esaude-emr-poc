'use strict';

angular.module('bahmni.common.domain')
    .service('conceptService', ['$http', function ($http) {

        this.get = function (concept) {
            return $http.get('/openmrs/ws/rest/v1/concept/' + concept, {
                params: {
                    v: "full"
                },
                withCredentials: true
            });
        };

    }]);
