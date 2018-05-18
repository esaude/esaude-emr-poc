(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'patientService', 'alertService',
    'visitService', 'authorizationService'];

  /* @ngInject */
  function DashboardController($rootScope, $scope, $state, $stateParams, patientService, alertService, visitService,
    authorizationService) {

    $scope.flags = [];
    $scope.patientUUID = $stateParams.patientUuid;
    $scope.todayVisit = null;
    $scope.hasLabOrderPrivilege = true;
    $scope.patient = {};

    $scope.reload = reload;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient($scope.patientUUID).then(function (patient) {
        $scope.patient = patient;
      });

      visitService.getTodaysVisit($scope.patientUUID).then(function (visitToday) {
        if (visitToday) {
          $scope.hasVisitToday = true;
          $scope.todayVisit = visitToday;
        } else {
          $scope.hasVisitToday = false;
        }
      });

      alertService.get($scope.patientUUID).then(function (response) {
        $scope.flags = response.data.flags;
      });

      checkLabOrderPrivilege();
    }

    function reload() {
      $state.reload();
    }

    function checkLabOrderPrivilege() {
      var privilegesToCheck = ['Write Test Order', 'Read Test Order', 'Edit Test Order'];
      privilegesToCheck.forEach(function (privilege) {
        authorizationService.hasPrivilege(privilege).then(function (hasPrivilege) {
          if (!hasPrivilege) {
            $scope.hasLabOrderPrivilege = false;
          }
        });
      });
    }
  }

})();

