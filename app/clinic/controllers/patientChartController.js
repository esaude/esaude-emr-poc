'use strict';

angular.module('clinic')
        .controller('PatientChartController', ["$scope", "$location", "$stateParams", 
                        "encounterService", "observationsService", "patientService", "openmrsPatientMapper",
                    function ($scope, $location, $stateParams, encounterService, 
                    observationsService, patientService, patientMapper) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
            
            patientService.get(patientUuid).success(function (data) {
                $scope.patient = patientMapper.map(data);
            });
        })();
        
        
        
        $scope.isObject = function (value) {
            return _.isObject(value);
        };
    }]);
