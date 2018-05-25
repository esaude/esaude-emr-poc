(function () {
  'use strict';

  angular
    .module('vitals')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({app: 'vitals', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        resolve: {
          initialization: 'initialization',
          createPatient: function () { return false },
          showSchedule: function () { return false },
        },
        ncyBreadcrumb: {
          label: '{{\'APP_VITALS\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        resolve: {
          initialization: 'initialization',
          clinicalServicesService: function (initialization, clinicalServicesService, $stateParams) {
            // We need initialization to always resolve first
            return clinicalServicesService.init('vitals', $stateParams.patientUuid);
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        }
      })
      .state('detailpatient', {
        url: '/patient/detail/:patientUuid',
        templateUrl: '../patient-details/views/patient-details.html',
        controller: 'DetailPatientController',
        controllerAs: 'patientCommon',
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
