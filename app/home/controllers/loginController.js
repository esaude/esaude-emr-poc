(function () {
  'use strict';

  angular
    .module('home')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$q', '$rootScope', '$scope', '$stateParams', '$translate', 'sessionService'];

  /* @ngInject */
  function LoginController($location, $q, $rootScope, $scope, $stateParams, $translate, sessionService) {

    var landingPagePath = "/dashboard";
    var loginPagePath = "/login";

    var vm = this;
    vm.errorMessageTranslateKey = null;
    vm.locales = [
      {label: 'Português', key: 'pt'},
      {label: 'English', key: 'en'}
    ];
    vm.loginUser = {};
    vm.selectedLocale = getSelectedLocale();
    vm.showMenu = true;

    vm.login = login;
    vm.updateLocale = updateLocale;

    activate();

    ////////////////

    function activate() {

      if ($stateParams.showLoginMessage) {
        vm.errorMessageTranslateKey = $stateParams.showLoginMessage;
      }

      if ($location.path() === loginPagePath) {
        redirectToLandingPageIfAlreadyAuthenticated();
      }

      setLocale(vm.selectedLocale);
    }

    function login() {
      vm.errorMessageTranslateKey = null;

      sessionService
        .loginUser(vm.loginUser.username, vm.loginUser.password)
        .then(function () {
          $location.path(landingPagePath).search({});
        })
        .catch(function (error) {
          vm.errorMessageTranslateKey = error;
          return $q.reject(error);
        });
    }

    function redirectToLandingPageIfAlreadyAuthenticated() {
      sessionService.getSession().then(function (session) {
        if (session.authenticated) {
          $location.path(landingPagePath);
        }
      });
    }

    function setLocale(locale) {
      return $translate.use(locale.key).then(sessionService.setLocale(locale.key));
    }

    function updateLocale(locale) {
      setLocale(locale);
    }

    function getSelectedLocale() {
      return $translate.use() ? _.find(vm.locales, {key: $translate.use()}) : vm.locales[0];
    }
  }

})();
