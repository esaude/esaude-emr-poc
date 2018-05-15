(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DashboardController', DashboardController);

  function DashboardController($state, $stateParams, patientService, authorizationService) {
    var patientUuid = $stateParams.patientUuid;

    var vm = this;
    vm.patient = {};
    vm.independentPharmacist = false;
    vm.print = print;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient(patientUuid).then(function (patient) {
        vm.patient = patient;
      });

      authorizationService.hasRole(['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)']).then(function (hasRole) {
        vm.independentPharmacist = hasRole;
      });

    }

    function reload() {
      $state.reload();
    }

  }

})();
