'use strict';

angular.module('registration')
        .controller('DashboardController', ["$scope", "$location", "$stateParams",
                    function ($scope, $location, $stateParams) {
            var patientUuid;

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
                $location.url("/patient/detail/" + patientUuid + "/identifiers"); // path not hash
            };
            
            $scope.linkServicesList = function() {
                $location.url("/services/" + patientUuid); // path not hash
            };
            
            $scope.linkPatientEdit = function() {
                $location.url("/patient/edit/" + patientUuid + "/identifier"); // path not hash
            };
            
            init();
            
        }]);
