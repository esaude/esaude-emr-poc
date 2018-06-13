(function () {
  'use strict';

  angular
    .module('application')
    .component('pocHeader', {
      controller: PocHeaderController,
      controllerAs: 'vm',
      templateUrl: '../common/application/components/pocHeader.html'
    });

  /* @ngInject */
  function PocHeaderController($rootScope, $window, ngDialog, sessionService) {

    var deregisterOnLogin = angular.noop;
    var deregisterOnLogout = angular.noop;

    var vm = this;

    vm.currentUser = null;
    vm.currentLocation = sessionService.getCurrentLocation();

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;
    vm.goHome = goHome;
    vm.isHome = isHome;

    ////////////////

    function $onInit() {
      loadData();
      deregisterOnLogin = $rootScope.$on('event:auth-login', loadData);
      deregisterOnLogout = $rootScope.$on('event:auth-logout', loadData);
    }

    function $onDestroy() {
      deregisterOnLogin();
      deregisterOnLogout();
    }

    function goHome () {
      $window.location.href = '/home';
    }

    function isHome() {
      // We should be using $state#includes but application structure does not allow that.
      return $window.location.pathname.match('/home/') !== null;
    }

    function loadData() {
      vm.currentLocation = sessionService.getCurrentLocation();
      sessionService.getCurrentUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });
    }

  }

})();
