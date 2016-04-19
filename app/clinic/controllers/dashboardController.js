'use strict';

angular.module('clinic')
        .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "patientService", "openmrsPatientMapper", "alertService", function ($rootScope, $scope, $location, $stateParams, patientService, patientMapper, alertService) {
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
    
            $scope.getAlerts = function () {
                alertService.get(patientUuid).success(function (data) {
                   $scope.flags = data.flags;
                });
            };
}]);
