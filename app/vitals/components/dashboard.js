(function () {
  'use strict';

  angular
    .module('vitals')
    .component('dashboard', {
      controller: DashboardController,
      controllerAs: 'vm',
      bindings: {
        patient: '<'
      },
      templateUrl: '../vitals/components/dashboard.html'
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
