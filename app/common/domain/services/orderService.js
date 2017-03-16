'use strict';

angular.module('bahmni.common.domain')
    .service('orderService', ['$http',
        function ($http) {

        this.get = function (orderUuid) {
            return $http.get(Bahmni.Common.Constants.orderUrl + "/" + orderUuid, {
                method: "GET",
                withCredentials: true
            });
        };

        this.getByType = function (orderUuid, type) {
            return $http.get(Bahmni.Common.Constants.orderUrl + "/" + orderUuid, {
                method: "GET",
                params:{
                    type: type
                },
                withCredentials: true
            });
        };

        this.getByPatient = function (patientUuid) {
            return $http.get(Bahmni.Common.Constants.orderUrl, {
                method: "GET",
                params:{
                    patient: patientUuid
                },
                withCredentials: true
            });
        };
}]);

