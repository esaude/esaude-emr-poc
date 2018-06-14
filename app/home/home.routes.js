(function () {
  'use strict';

  angular
    .module('home')
    .config(config);

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('dashboard');
    });

    $bahmniTranslateProvider.init({app: 'home', shouldMerge: true});

    $stateProvider
      .state('login', {
        url: '/login?showLoginMessage=LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY',
        component: 'login',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        component: 'dashboard',
        resolve: {
          initialization: 'initialization'
        },
        ncyBreadcrumb: {
          skip: true
        }
      });

  }

})();
