'use strict';

angular.module('bahmni.common.domain')
    .service('prescriptionService', ['$http', '$q', '$rootScope', 'configurations', '$cookieStore', function ($http, $q, $rootScope, configurations, $cookieStore) {

    this.getPatientPrescriptions = function (patientUuid) {
      	
    	 return $http.get(Bahmni.Common.Constants.prescriptionUrl, {
            
            params:{
                patient: patientUuid
            },

            withCredentials : true
        });
    };

}]);