'use strict';

angular.module('poc.common.formdisplay')
    .factory('formLoader', ['$q', 'formService', function ($q, formService) {
        
        var existingPromises = {};

        var load = function (forms) {
            //debugger
            var promiseDefer = $q.defer();
            var promises = [];
            var loadedForms = [];
            
            _.forEach(forms, function(form) {
                if (!existingPromises[form.id]) {
                existingPromises[form.id] = formService.fetchByUuid(form.formId).then(function (response) {
                    loadedForms[form.id] = response;
                });
                promises.push(existingPromises[form.id]);
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
