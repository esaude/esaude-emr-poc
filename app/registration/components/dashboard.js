(function () {
  'use strict';

  angular
    .module('registration')
    .component('dashboard', {
      bindings: {
        patient: '<',
      },
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../registration/components/dashboard.html',
    });

  /* @ngInject */
  function DashboardController($state) {

    var vm = this;

    vm.linkSearch = linkSearch;
    vm.reload = reload;

    function linkSearch() {
      $state.go('search');
    }

    function reload() {
      $state.reload();
    }

  }

})();

