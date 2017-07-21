'use strict';

angular.module('clinic')
  .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "$filter", "patientService",
    "alertService",
    function ($rootScope, $scope, $location, $stateParams, $filter, patientService, alertService) {
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
                $location.url("/patient/detail/" + patientUuid); // path not hash
            };

            $scope.getAlerts = function () {
                alertService.get(patientUuid).success(function (data) {
                    $scope.flags = data.flags;
                });
            };
    }]);
