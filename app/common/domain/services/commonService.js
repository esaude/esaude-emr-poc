'use strict';

angular.module('bahmni.common.domain')
    .service('commonService', ['$http', '$q', '$rootScope',
        function ($http, $q, $rootScope) {
    
    this.filterRetired = function (entities) {
        return _.filter(entities, function (entity) {
            return !entity.voided;
        });
    };

    this.filterLast = function (entities) {
        return _.filter(entities, function (entity) {
            return !entity.voided;
        });
    };
    
}]);

