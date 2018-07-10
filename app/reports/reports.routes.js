(() => {
  'use strict';

  angular
      .module('reports')
    .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

    /* @ngInject */
    function config ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

      // to prevent the browser from displaying a password pop-up in case of an authentication error
      $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
      $urlRouterProvider.otherwise($injector => {
        $injector.get('$state').go('dashboard');
      });

      const REPORTS_APP_ID = 'reports';
      $bahmniTranslateProvider.init({app: REPORTS_APP_ID, shouldMerge: true});

      $stateProvider
        .state('root', {
          abstract: true,
          data: {authorization: REPORTS_APP_ID},
        })
        .state('dashboard', {
          url: '/dashboard',
          component: 'dashboard',
          ncyBreadcrumb: {
            label: '{{\'APP_REPORTS\' | translate}} /  {{\'DASHBOARD\' | translate}}'
          },
          parent: 'root',
        });

    }
})();
