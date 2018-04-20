(function () {
  'use strict';

  angular
    .module('social')
    .component('dashboard', {
      controller: DashboardController,
      controllerAs: 'vm',
      bindings: {
        patient: '<'
      },
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
