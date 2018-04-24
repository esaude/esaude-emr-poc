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
    $scope.hasLabOrderPrivilege = false;
    $scope.patient = {};

    $scope.getAlerts = getAlerts;
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

      checkLabOrderPrivilege();
    }

    function getAlerts() {
      alertService.get($scope.patientUUID).success(function (data) {
        $scope.flags = data.flags;
      });
    }

    function reload() {
      $state.reload();
    }

    function checkLabOrderPrivilege() {
      var privilegesToCheck = ['Write Test Order', 'Read Test Order', 'Update Test Order'];
      privilegesToCheck.forEach(function (privilege) {
        authorizationService.hasPrivilege(privilege).then(function (hasPrivilege) {
          if (hasPrivilege) {
            $scope.hasLabOrderPrivilege = true;
          }
        });
      });
    }
  }

})();

