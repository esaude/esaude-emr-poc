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
  function DashboardController($state) {

    var vm = this;

    vm.reload = reload;

    function reload() {
      $state.reload();
    }

  }

})();
