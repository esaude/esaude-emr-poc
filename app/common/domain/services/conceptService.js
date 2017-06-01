'use strict';

angular.module('bahmni.common.domain')
    .service('conceptService', ['$http', function ($http) {

        return {
            get: get,
            getPrescriptionConvSetConcept: getPrescriptionConvSetConcept
        };

        function get(concept) {
            return $http.get('/openmrs/ws/rest/v1/concept/' + concept, {
                params: {
                    v: "full"
                },
                withCredentials: true
            });
        }

        function getPrescriptionConvSetConcept() {
            var concept = Bahmni.Common.Constants.prescriptionConvSetConcept;
            return get(concept).then(function (response) {
                return response.data.setMembers;
            });
        }


    }]);
