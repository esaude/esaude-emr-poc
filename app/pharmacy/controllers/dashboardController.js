(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$stateParams', 'patientService'];

  function DashboardController($state, $stateParams, patientService) {
    var patientUuid = $stateParams.patientUuid;

    var vm = this;
    vm.patient = {};
    vm.print = print;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient(patientUuid).then(function (patient) {
        vm.patient = patient;
      });
    }

    function reload() {
      $state.reload();
    }

  }

})();
