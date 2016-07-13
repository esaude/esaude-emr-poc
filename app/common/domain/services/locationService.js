'use strict';

angular.module('bahmni.common.domain')
    .factory('locationService', ['$http', function ($http) {
        var getAllByTag = function (tags) {
            return $http.get(Bahmni.Common.Constants.locationUrl, {
                params: {s: "byTags", q: tags || ""},
                cache: true
            });
        };
        
        var get = function (name) {
            return $http.get(Bahmni.Common.Constants.locationUrl, {
                params: {q: name},
                cache: true,
                withCredentials: false
            });
        };

        return {
            getAllByTag: getAllByTag,
            get: get
        };

    }]);
