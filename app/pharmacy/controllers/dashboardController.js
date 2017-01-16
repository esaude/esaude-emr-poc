'use strict';

angular.module('pharmacy')
        .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "patientService", "openmrsPatientMapper", function ($rootScope, $scope, $location, $stateParams, patientService, patientMapper) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
            
                patientService.get(patientUuid).success(function (data) {
                    $rootScope.patient = patientMapper.map(data);
                });
            }
            
            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };
            
            $scope.linkPatientDetail = function() {
                $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
            }; 
        }]);
