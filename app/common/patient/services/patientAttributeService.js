'use strict';

angular.module('common.patient')
    .factory('patientAttributeService', ['$http', $http => {

    var urlMap;

    var init = () => {
        urlMap = {
            "personName" : Bahmni.Common.Constants.bahmniSearchUrl + "/personname",
            "personAttribute" : Bahmni.Common.Constants.bahmniSearchUrl + "/personattribute"
        };
    };
    init();

    var search = (fieldName, query, type) => {
        var url = urlMap[type];
        var queryWithoutTrailingSpaces = query.trimLeft();

        return $http.get(url, {
            method: "GET",
            params: {q: queryWithoutTrailingSpaces, key: fieldName },
            withCredentials: true
        });
    };

    return{
        search : search
    };
}]);
