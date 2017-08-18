(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$scope', '$location', '$stateParams', 'patientService', 'alertService',
    'visitService'];

  /* @ngInject */
  function DashboardController($rootScope, $scope, $location, $stateParams, patientService, alertService, visitService) {

    $scope.flags = [];
    $scope.patientUUID = $stateParams.patientUuid;
    $scope.todayVisit = null;

    $scope.getAlerts = getAlerts;
    $scope.linkSearch = linkSearch;
    $scope.linkPatientDetail = linkPatientDetail;


    activate();

    ////////////////

    function activate() {
      patientService.getPatient($scope.patientUUID).then(function (patient) {
        $rootScope.patient = patient;
      });

      visitService.getTodaysVisit($scope.patientUUID).then(function (visitToday) {
        if (visitToday) {
          $scope.hasVisitToday = true;
          $scope.todayVisit = visitToday;
        } else {
          $scope.hasVisitToday = false;
        }
      });
    }

    function linkSearch() {
      $location.url("/search"); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + $scope.patientUUID); // path not hash
    }

    function getAlerts() {
      alertService.get($scope.patientUUID).success(function (data) {
        $scope.flags = data.flags;
      });
    }
  }

})();

