'use strict';

angular.module('social')
        .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "patientService", function ($rootScope, $scope, $location, $stateParams, patientService) {
            var patientUuid;

            init();

            function init() {
                patientUuid = $stateParams.patientUuid;

                patientService.getPatient(patientUuid).then(function (patient) {
                    $rootScope.patient = patient;
                });
            }

            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };

            $scope.linkPatientDetail = function() {
                $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
            };
        }]);
