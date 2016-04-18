'use strict';

angular.module('clinic')
        .controller('DashboardController', ["$scope", "$location", "$stateParams", "alertService", 
                    function ($scope, $location, $stateParams, alertService) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
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
