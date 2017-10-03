(function () {
  'use strict';

  angular
    .module('social')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$state', '$stateParams', 'patientService', 'visitService'];

  /* @ngInject */
  function DashboardController($scope, $state, $stateParams, patientService, visitService) {

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
      $state.go('search');
    }

    function linkPatientDetail() {
      $state.go('detailpatient', {
        patientUuid: $scope.patientUuid,
        returnState: $state.current
      });
    }
  }

})();
