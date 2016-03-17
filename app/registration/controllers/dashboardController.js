'use strict';

angular.module('registration')
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
            
            $scope.linkVisit = function() {
                $location.url("/visit/" + patientUuid); // path not hash
            };
            
            $scope.linkPatientDetail = function() {
                $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
            };
            
            $scope.linkServicesList = function() {
                $location.url("/services/" + patientUuid); // path not hash
            };
            
            $scope.linkPatientEdit = function() {
                $location.url("/patient/edit/" + patientUuid + "/name"); // path not hash
            };
            
            $scope.getAlerts = function () {
                alertService.get(patientUuid).success(function (data) {
                   $scope.flags = data.flags;
                });
            };
            
        }]);
