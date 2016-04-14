'use strict';

angular.module('clinic')
        .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "patientService", "openmrsPatientMapper", 
                    function ($rootScope, $scope, $location, $stateParams, patientService, patientMapper) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                patientUuid = $stateParams.patientUuid;
            
                patientService.get(patientUuid).success(function (data) {
                    $rootScope.patient = patientMapper.map(data);
                });
            }
            
            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };
            
        }]);
