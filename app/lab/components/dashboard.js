(function () {
  'use strict';

  angular
    .module('lab')
    .component('dashboard', {
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../lab/components/dashboard.html'
    });

  DashboardController.$inject = ['$state', '$stateParams', 'patientService'];

  /* @ngInject */
  function DashboardController($state, $stateParams, patientService) {

    var vm = this;

    vm.patient = {};

    vm.$onInit = $onInit;
    vm.reload = reload;


    function $onInit() {
      patientService.getPatient($stateParams.patientUuid).then(function (patient) {
        vm.patient = patient;
      });
    }

    function reload() {
      $state.reload();
    }

  }

})();
