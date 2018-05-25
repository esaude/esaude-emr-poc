(function () {
  'use strict';

  angular
    .module('clinic')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({ app: 'clinical', shouldMerge: true });

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        resolve: {
          initialization: 'initialization',
          createPatient: function () { return false },
          showSchedule: function () { return true },
          scheduleType: function () { return 'currentProvider' },
        },
        ncyBreadcrumb: {
          label: '{{\'APP_CLINIC\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        resolve: {
          initialization: 'initialization'
        },
        ncyBreadcrumb: {
          label: '{{\'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        }
      })
      .state('dashboard.summary', {
        url: '/summary',
        templateUrl: 'views/patient-summary.html',
        controller: 'PatientSummaryController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CHART_SUMMARY\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      .state('dashboard.chart', {
        url: '/chart',
        component: 'patientCharts',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CHARTS\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      .state('dashboard.prescriptions', {
        url: '/prescription',
        templateUrl: 'views/patient-prescriptions.html',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_PRESCRIPTIONS\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      .state('dashboard.laboratory', {
        url: '/laboratory',
        templateUrl: '../common/test/views/lab-request.html',
        controller: 'LabRequestController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_LABORATORY\' | translate}}',
          parent: 'dashboard',
          skip: true
        },
        params: {
          externalRequest: false
        }
      })
      .state('dashboard.consultation', {
        url: '/consultation',
        templateUrl: 'views/patient-consultation.html',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CONSULTATION\' | translate}}',
          parent: 'dashboard',
          skip: true
        },
        resolve: {
          clinicalServicesService: function (clinicalServicesService, $stateParams) {
            return clinicalServicesService.init('clinical', $stateParams.patientUuid);
          }
        }
      })
      .state('dashboard.current', {
        url: '/current',
        templateUrl: 'views/patient-current.html',
        controller: 'PatientCurrentController',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CURRENT_STATUS\' | translate}}',
          parent: 'dashboard',
          skip: true
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
