(function () {
  'use strict';

  angular
    .module('home')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$q', '$rootScope', '$scope', '$stateParams', '$translate', 'sessionService',
    'spinner'];

  /* @ngInject */
  function LoginController($location, $q, $rootScope, $scope, $stateParams, $translate, sessionService, spinner) {

    var landingPagePath = "/dashboard";
    var loginPagePath = "/login";

    var vm = this;
    vm.errorMessageTranslateKey = null;
    vm.locales = ['en', 'pt'];
    vm.selectedLocale = $translate.use() ? $translate.use() : vm.locales[0];
    vm.showMenu = true;

    // TODO: remove this later, needed in common/application/views/header.html
    $scope.showMenu = vm.showMenu;

    vm.login = login;
    vm.updateLocale = updateLocale;

    activate();

    ////////////////

    function activate() {
      $rootScope.loginUser = {};

      if ($stateParams.showLoginMessage) {
        vm.errorMessageTranslateKey = $stateParams.showLoginMessage;
      }

      if ($location.path() === loginPagePath) {
        redirectToLandingPageIfAlreadyAuthenticated();
      }

      spinner.forPromise(setLocale(vm.selectedLocale));
    }

    function login() {
      vm.errorMessageTranslateKey = null;
      var deferrable = $q.defer();
      sessionService.loginUser($scope.loginUser.username, $scope.loginUser.password, vm.selectedLocale).then(
        function () {
          sessionService.loadCredentials().then(
            function () {
              deferrable.resolve();
            },
            function (error) {
              vm.errorMessageTranslateKey = error;
              deferrable.reject(error);
            }
          )
        },
        function (error) {
          vm.errorMessageTranslateKey = error;
          deferrable.reject(error);
        }
      );
      spinner.forPromise(deferrable.promise).then(
        function () {
          $location.path(landingPagePath).search({});
        }
      );
    }

    function redirectToLandingPageIfAlreadyAuthenticated() {
      sessionService.getSession().then(function (session) {
        if (session.authenticated) {
          $location.path(landingPagePath);
        }
      });
    }

    function setLocale(locale) {
      return $translate.use(locale).then(sessionService.setLocale(locale));
    }

    function updateLocale(locale) {
      spinner.forPromise(setLocale(locale));
    }
  }

})();
