(() => {
  'use strict';

  angular
    .module('vitals')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise($injector => {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({app: 'vitals', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        resolve: {
          initialization: 'initialization',
          createPatient: () => false,
          showSchedule: () => false,
        },
        ncyBreadcrumb: {
          label: '{{\'APP_VITALS\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        resolve: {
          initialization: 'initialization',
          patient: (initialization, $stateParams, patientService) => {
            // We need initialization to always resolve first
            return patientService.getPatient($stateParams.patientUuid);
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        }
      })
      .state('dashboard.clinicalservices', {
        url: '/clinicalservices',
        component: 'clinicalServices',
        resolve: {
          initialization: 'initialization',
          clinicalServicesService: (initialization, clinicalServicesService, $stateParams) => {
            // We need initialization to always resolve first
            return clinicalServicesService.init('vitals', $stateParams.patientUuid);
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'COMMON_CLINIC_SERVICES_TITLE\' | translate}}',
          parent: 'search'
        }
      })
      .state('detailpatient', {
        url: '/patient/detail/:patientUuid',
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
