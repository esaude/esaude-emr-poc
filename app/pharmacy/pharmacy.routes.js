(() => {
  'use strict';

  angular
    .module('pharmacy')
    .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

    /* @ngInject */
    function config ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

      // to prevent the browser from displaying a password pop-up in case of an authentication error
      $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
      $urlRouterProvider.otherwise($injector => {
        $injector.get('$state').go('search');
      });


      const PHARMACY_APP_ID = 'pharmacy';
      $bahmniTranslateProvider.init({app: PHARMACY_APP_ID, shouldMerge: true});

      $stateProvider
        .state('root', {
          abstract: true,
          data: {authorization: PHARMACY_APP_ID},
          resolve: {
            initialization: 'initialization',
          }
        })
        .state('search', {
          url: '/search',
          component: 'patientSearch',
          parent: 'root',
          resolve: {
            createPatient: () => false,
            showSchedule: () => true,
            scheduleType: () => 'drugPickup',
          },
          ncyBreadcrumb: {
            label: '{{\'APP_PHARMACY\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
          }
        })
        .state('dashboard', {
          url: '/dashboard/:patientUuid',
          component: 'dashboard',
          parent: 'root',
          resolve: {
            patient: ($stateParams, initialization, patientService) => {
              // initialization is needed here so this is resolved after it
              return patientService.getPatient($stateParams.patientUuid);
            }
          },
          ncyBreadcrumb: {
            label: '{{ \'COMMON_DASHBOARD\' | translate}}',
            parent: 'search'
          }
        })
        .state('dashboard.prescriptions', {
          component: 'prescription',
          resolve: {
            patient: ($stateParams, initialization, patientService) => patientService.getPatient($stateParams.patientUuid),
            retrospectiveMode: () => true
          },
          ncyBreadcrumb: {
            label: '{{\'CLINIC_PATIENT_PRESCRIPTIONS\' | translate}}',
            parent: 'dashboard',
            skip: true
          }
        })
        .state('dashboard.filaHistory', {
          url: '/fila-history',
          component: 'filaHistory',
          ncyBreadcrumb: {
            label: '{{\'PHARMACY_HISTORY_FILA\' | translate}}',
            parent: 'dashboard',
            skip: true
          }
        })
        .state('dashboard.dispensationHistory', {
          url: '/dispensation-history',
          component: 'dispensationHistory',
          ncyBreadcrumb: {
            label: '{{\'PHARMACY_HISTORY_PICKUP\' | translate}}',
            parent: 'dashboard',
            skip: true
          }
        })
        .state('dashboard.dispensation', {
          url: '/dispensation',
          component: 'dispensation',
          ncyBreadcrumb: {
            label: '{{\'PHARMACY_DISPENSATION\' | translate}}',
            parent: 'dashboard',
            skip: true
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
