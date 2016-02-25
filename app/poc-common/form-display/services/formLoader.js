'use strict';

angular.module('poc.common.formdisplay')
    .factory('formLoader', ['$q', 'formService', function ($q, formService) {
        
        var existingPromises = {};

        var load = function (formIds) {
            var promiseDefer = $q.defer();
            var promises = [];
            var loadedForms = [];
            
            _.forEach(formIds, function(uuid) {
                if (!existingPromises[uuid]) {
                existingPromises[uuid] = formService.getByUuid(uuid).then(function (response) {
                    loadedForms[uuid] = response.data;
                });
                promises.push(existingPromises[uuid]);
            }
            });
            $q.all(promises).then(function () {
                promiseDefer.resolve(loadedForms);
            });

            return promiseDefer.promise;
        };
        
        return {
            load: load
        };
        
    }]);