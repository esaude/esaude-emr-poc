(function () {
  'use strict';

  angular
    .module('social')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$stateParams', 'patientService', 'visitService'];

  /* @ngInject */
  function DashboardController($state, $stateParams, patientService, visitService) {

    var vm = this;

    vm.patientUuid = $stateParams.patientUuid;
    vm.todayVisit = null;

    vm.linkPatientDetail = linkPatientDetail;
    vm.linkSearch = linkSearch;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient(vm.patientUuid).then(function (patient) {
        vm.patient = patient;
      });

      visitService.getTodaysVisit(vm.patientUuid).then(function (visitToday) {
        if (visitToday) {
          vm.hasVisitToday = true;
          vm.todayVisit = visitToday;
        } else {
          vm.hasVisitToday = false;
        }
      });
    }

    function linkSearch() {
      $state.go('search');
    }

    function linkPatientDetail() {
      $state.go('detailpatient', {
        patientUuid: vm.patientUuid,
        returnState: $state.current
      });
    }
  }

})();
