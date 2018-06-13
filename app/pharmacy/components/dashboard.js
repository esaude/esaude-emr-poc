(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('dashboard', {
      bindings: {
        patient: '<'
      },
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/dashboard.html'
    });

  /* @ngInject */
  function DashboardController($state, authorizationService) {

    var vm = this;

    vm.independentPharmacist = false;

    vm.$onInit = $onInit;
    vm.reload = reload;

    function $onInit() {
      var independentPharmacistRoles = ['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)'];
      authorizationService.hasRole(independentPharmacistRoles).then(function (hasRole) {
        vm.independentPharmacist = hasRole;
      });
    }

    function reload() {
      $state.reload();
    }

  }

})();
