(function () {
  'use strict';

  angular
    .module('application')
    .directive('pocHeader', pocHeader)
    .controller('PocHeaderController', PocHeaderController);

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

  PocHeaderController.$inject = ['$window', 'ngDialog', 'sessionService', 'translateFilter'];

  /* @ngInject */
  function PocHeaderController($window, ngDialog, sessionService, translateFilter) {

    var vm = this;
    vm.currentUser = {};
    vm.currentLocation = sessionService.getCurrentLocation();

    vm.goHome = goHome;
    vm.isHome = isHome;

    activate();

    ////////////////

    function activate() {
      sessionService.getCurrentUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });
    }

    function goHome () {
      $window.location.href = '/home';
    }

    function isHome() {
      return $window.location.pathname.startsWith('/home/');
    }

  }

})();
