'use strict';

angular.module('clinic')
  .controller('DashboardController', ["$rootScope", "$scope", "$location", "$stateParams", "$filter", "patientService", "openmrsPatientMapper",
    "alertService",
    function ($rootScope, $scope, $location, $stateParams, $filter, patientService, patientMapper, alertService) {
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

      $scope.getAlerts = function () {
                alertService.get(patientUuid).success(function (data) {
                   $scope.flags = data.flags;
                });
      };
    }]);
