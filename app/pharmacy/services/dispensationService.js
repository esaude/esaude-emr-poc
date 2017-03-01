'use strict';

angular.module('bahmni.common.domain')
    .service('dispensationService', ['$http', '$q', '$rootScope', 'configurations', '$cookieStore', function ($http, $q, $rootScope, configurations, $cookieStore) {

    this.create = function (dispensation) {
    	
    	return $http.post(Bahmni.Common.Constants.dispensationUrl, dispensation, {
            withCredentials:true,
            headers: {"Accept": "application/json", "Content-Type": "application/json"}
        });
    };

}]);