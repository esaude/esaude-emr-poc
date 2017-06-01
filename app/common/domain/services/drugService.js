'use strict';

angular.module('bahmni.common.domain')
    .service('drugService', ['$http',
        function ($http) {

        this.get = function (regimenUuid) {
            return $http.get(Bahmni.Common.Constants.drugRegimenUrl, {
                method: "GET",
                params: {
                    regime : regimenUuid
                },
                withCredentials: true
            });
        };
}]);

