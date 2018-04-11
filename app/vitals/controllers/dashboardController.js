(function () {
  'use strict';

  angular
    .module('vitals')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$stateParams', 'patientService', 'visitService'];

  /* @ngInject */
  function DashboardController($state, $stateParams, patientService, visitService) {

    var vm = this;

    vm.patientUUID = $stateParams.patientUuid;
    vm.todayVisit = null;
    vm.patient = {};


    activate();

    ////////////////

    function activate() {
      patientService.getPatient(vm.patientUUID).then(function (patient) {
        vm.patient = patient;
      });

      visitService.getTodaysVisit(vm.patientUUID).then(function (visitToday) {
        if (visitToday) {
          vm.hasVisitToday = true;
          vm.todayVisit = visitToday;
        } else {
          vm.hasVisitToday = false;
        }
      });
    }


  }

})();
