'use strict';
angular.module('poc.common.formdisplay')
    .factory('formService', ['$http',function ($http) {

        var fetchByUuid = function(formUuid) {
            return $http.get("/openmrs/ws/rest/v1/form" + "/" + formUuid, {
                method: "GET",
                params: {
                    v: "full"
                },
                withCredentials: true
            }).success(function (data) {
                _.forEach(data.formFields, function (formField) {
                    formField.fieldConcept = {};
                    formField.fieldConcept = $http.get("/openmrs/ws/rest/v1/field" + "/" + formField.field.uuid, {
                                method: "GET",
                                params: {
                                    v: "full"
                                },
                                withCredentials: true
                    }).success(function (fieldConcept) {
                        return fieldConcept;
                            });
                        });
                return data;
            });
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
