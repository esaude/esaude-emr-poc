(function () {
  'use strict';

  angular
    .module('social')
    .component('dashboard', {
      controller: DashboardController,
      bindings: {
        patient: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../social/components/dashboard.html'
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
