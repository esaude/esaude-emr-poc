(function () {
  'use strict';

  angular
    .module('lab')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({app: 'lab', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'search',
        ncyBreadcrumb: {
          label: '{{\'APP_LAB\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        },
        resolve: {
          initialization: 'initialization'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        ncyBreadcrumb: {
          label: '{{\'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        },
        resolve: {
          initialization: 'initialization'
        }
      })
      .state('dashboard.testorders', {
        url: '/testorders',
        component: 'labTests',
        ncyBreadcrumb: {
          label: '{{\'TESTS\' | translate }}',
          parent: 'dashboard'
        }
      })
      .state('detailpatient', {
        url: '/patient/:patientUuid',
        component: 'patientDetails',
        ncyBreadcrumb: {
          label: '{{\'PATIENT_DETAILS\' | translate }}',
          parent: 'dashboard'
        },
        params: {
          returnState: null
        },
        resolve: {
          initialization: 'initialization'
        }
      });
  }
})();
