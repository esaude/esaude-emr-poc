(function () {
  'use strict';

  angular
    .module('social')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({app: 'social', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        bindings: {showSchedule: false},
        ncyBreadcrumb: {
          label: '{{\'APP_SOCIAL\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        },
        resolve: {
          initialization: 'initialization',
          patient: function (initialization, $stateParams, patientService) {
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
          clinicalServicesService: function (clinicalServicesService, $stateParams) {
            return clinicalServicesService.init('social', $stateParams.patientUuid);
          }
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
        resolve: {
          initialization: 'initialization'
        },
        ncyBreadcrumb: {
          label: '{{\'PATIENT_DETAILS\' | translate }}',
          parent: 'dashboard'
        }
      });
  }
})();
