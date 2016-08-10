'use strict';

angular.module('bahmni.common.domain')
    .service('cohortService', ['$http',
        function ($http) {

        this.get = function (cohortUuid) {
            return $http.get(Bahmni.Common.Constants.cohortUrl + "/" + cohortUuid, {
                method: "GET",
                withCredentials: true
            });
        };

        this.getWithParams = function (cohortUuid, params) {
            return $http.get(Bahmni.Common.Constants.cohortUrl + "/" + cohortUuid, {
                method: "GET",
                params: params,
                withCredentials: true
            });
        };

        this.getDefinition = function (cohortDefinitionUuid) {
            return $http.get("/openmrs/ws/rest/v1/reportingrest/cohortDefinition" + "/" + cohortDefinitionUuid, {
                withCredentials: true
            });
        };
}]);

