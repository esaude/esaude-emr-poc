(function () {
  'use strict';

  angular
    .module('social')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$location', '$stateParams', 'patientService', 'visitService'];

  /* @ngInject */
  function DashboardController($scope, $location, $stateParams, patientService, visitService) {

    $scope.patientUuid = $stateParams.patientUuid;
    $scope.todayVisit = null;

    $scope.linkPatientDetail = linkPatientDetail;
    $scope.linkSearch = linkSearch;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient($scope.patientUuid).then(function (patient) {
        $scope.patient = patient;
      });

      visitService.getTodaysVisit($scope.patientUuid).then(function (visitToday) {
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
      $location.url("/patient/detail/" + $scope.patientUuid); // path not hash
    }
  }

})();
