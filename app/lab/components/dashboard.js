(function () {
  'use strict';

  angular
    .module('lab')
    .component('dashboard', {
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../lab/components/dashboard.html'
    });

  DashboardController.$inject = ['$stateParams', 'patientService'];

  /* @ngInject */
  function DashboardController($stateParams, patientService) {

    var vm = this;

    vm.patient = {};

    vm.$onInit = $onInit;

    function $onInit() {
      patientService.getPatient($stateParams.patientUuid).then(function (patient) {
        vm.patient = patient;
      });
    }

  }

})();
