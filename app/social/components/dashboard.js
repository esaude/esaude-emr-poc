(function () {
  'use strict';

  angular
    .module('social')
    .component('dashboard', {
      bindings: {
        patient: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../social/components/dashboard.html'
    });

})();
