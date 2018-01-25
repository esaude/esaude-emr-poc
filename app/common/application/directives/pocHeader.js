(function () {
  'use strict';

  angular
    .module('application')
    .directive('pocHeader', pocHeader);

  pocHeader.$inject = [];

  /* @ngInject */
  function pocHeader() {
    var directive = {
      bindToController: true,
      controller: PocHeaderController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: '../common/application/directives/pocHeader.html'
    };
    return directive;
  }

  PocHeaderController.$inject = ['sessionService'];

  /* @ngInject */
  function PocHeaderController(sessionService) {

    var vm = this;
    vm.currentUser = {};
    vm.currentLocation = sessionService.getCurrentLocation();

    activate();

    ////////////////

    function activate() {
      sessionService.getCurrentUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });
    }


  }

})();

