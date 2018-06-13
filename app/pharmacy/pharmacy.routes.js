(function () {
  'use strict';

  angular
      .module('pharmacy')
    .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

    /* @ngInject */
    function config ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

      // to prevent the browser from displaying a password pop-up in case of an authentication error
      $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
      $urlRouterProvider.otherwise(function ($injector) {
        $injector.get('$state').go('search');
      });

      $bahmniTranslateProvider.init({app: 'pharmacy', shouldMerge: true});

      $stateProvider
        .state('search', {
          url: '/search',
          component: 'patientSearch',
          resolve: {
            initialization: 'initialization',
            createPatient: function () { return false },
            showSchedule: function () { return true },
            scheduleType: function () { return 'drugPickup' },
          },
          ncyBreadcrumb: {
            label: '{{\'APP_PHARMACY\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
          }
        })
        .state('dashboard', {
          url: '/dashboard/:patientUuid',
          component: 'dashboard',
          resolve: {
            initialization: 'initialization',
            patient: function ($stateParams, initialization, patientService) {
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
          url: '/prescription',
          templateUrl: 'views/patient-simplified-prescriptions.html',
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
