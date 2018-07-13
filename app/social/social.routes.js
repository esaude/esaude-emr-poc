(() => {
  'use strict';

  angular
    .module('social')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise($injector => {
      $injector.get('$state').go('search');
    });

    const SOCIAL_APP_ID = 'social';
    $bahmniTranslateProvider.init({app: SOCIAL_APP_ID, shouldMerge: true});

    $stateProvider
      .state('root', {
        abstract: true,
        data: {authorization: SOCIAL_APP_ID},
        resolve: {
          initialization: 'initialization',
        }
      })
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        ncyBreadcrumb: {
          label: '{{\'APP_SOCIAL\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
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
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        },
        parent: 'root',
        resolve: {
          patient: (initialization, $stateParams, patientService) => {
            // We need initialization to always resolve first
            return patientService.getPatient($stateParams.patientUuid);
          }
        }
      })
      .state('dashboard.services', {
        url: '/services',
        component: 'clinicalServices',
        ncyBreadcrumb: {
          label: '{{\'COMMON_CLINIC_SERVICES_TITLE\' | translate}}',
          parent: 'dashboard'
        },
        resolve: {
          clinicalServicesService: (clinicalServicesService, $stateParams) => clinicalServicesService.init(SOCIAL_APP_ID, $stateParams.patientUuid)
        }
      })
      .state('dashboard.partners', {
        url: '/partners',
        component: 'sexualPartners',
        ncyBreadcrumb: {
          label: '{{ \'SEXUAL_PARTNERS\' | translate}}',
          parent: 'dashboard'
        }
      })
      .state('detailpatient', {
        url: '/patient/detail/:patientUuid',
        component: 'patientDetails',
        params: {
          returnState: null
        },
        parent: 'root',
        ncyBreadcrumb: {
          label: '{{\'PATIENT_DETAILS\' | translate }}',
          parent: 'dashboard'
        }
      });
  }
})();
