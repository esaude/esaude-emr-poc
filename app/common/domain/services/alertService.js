'use strict';

angular.module('bahmni.common.domain')
    .service('alertService', ['$http', function ($http) {

        this.get = function(patientUuid){
            return $http.get('/openmrs/ws/rest/v1/flags/' + patientUuid, {
                params: {
                },
                withCredentials: true
            });
        };

    }]);
