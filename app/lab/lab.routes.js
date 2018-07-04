(() => {
  'use strict';

  angular
    .module('lab')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise($injector => {
      $injector.get('$state').go('search');
    });

    const LAB_APP_ID = 'lab';
    $bahmniTranslateProvider.init({ app: LAB_APP_ID, shouldMerge: true });

    $stateProvider
      .state('root', {
        abstract: true,
        data: {authorization: LAB_APP_ID},
        resolve: {
          initialization: 'initialization',
        }
      })
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        ncyBreadcrumb: {
          label: '{{\'APP_LAB\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        },
        parent: 'root',
        resolve: {
          createPatient: () => false,
          showSchedule: () => false,
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        parent: 'root',
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
          label: '{{\'RESULTS\' | translate }}',
          parent: 'dashboard'
        }
      })
      .state('dashboard.testrequest', {
        url: '/testrequest',
        templateUrl: '../common/test/views/lab-request.html',
        controller: 'LabRequestController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: '{{\'LAB_ORDER\' | translate}}',
          parent: 'dashboard',
        },
        params: {
          externalRequest: true
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
        parent: 'root',
      });
  }
})();
