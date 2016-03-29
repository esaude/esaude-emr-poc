'use strict';
angular.module('poc.common.formdisplay')
    .factory('formService', ['$q', '$http',function ($q, $http) {

        var fetchByUuid = function(formUuid) {
            var deferrable = $q.defer();
            $http.get("/openmrs/ws/rest/v1/form" + "/" + formUuid, {
                method: "GET",
                params: {
                    v: "full"
                },
                withCredentials: true
            }).success(function (data) {
                _.forEach(data.formFields, function (formField) {
                    $http.get("/openmrs/ws/rest/v1/field" + "/" + formField.field.uuid, {
                                method: "GET",
                                params: {
                                    v: "full"
                                },
                                withCredentials: true
                    }).success(function (fieldConcept) {
                        formField.fieldConcept = fieldConcept;
                    });
                    deferrable.resolve(data);
                });
            });
            return deferrable.promise;
        };
        
        var getByUuid = function(formUuid) {
            return $http.get("/openmrs/ws/rest/v1/form" + "/" + formUuid, {
                method: "GET",
                params: {
                    v: "full"
                },
                withCredentials: true
            });
        };

        return {
            getByUuid: getByUuid,
            fetchByUuid: fetchByUuid
        };
    }]);
