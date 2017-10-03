(function () {
  'use strict';

  angular
    .module('vitals')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'patientService', 'visitService'];

  /* @ngInject */
  function DashboardController($rootScope, $scope, $state, $stateParams, patientService, visitService) {

    $scope.patientUUID = $stateParams.patientUuid;
    $scope.todayVisit = null;

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
      $state.go('search');
    }

    function linkPatientDetail() {
      $state.go('detailpatient', {
        patientUuid: $scope.patientUUID,
        returnState: $state.current
      });
    }
  }

})();
