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

    $bahmniTranslateProvider.init({app: 'clinical', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        views: {
          'layout': {
            templateUrl: '../common/application/views/layout.html'
          },
          'content@search': {
            templateUrl: 'views/search.html'
          }
        },
        resolve: {
          initialization: 'initialization'
        },
        ncyBreadcrumb: {
          label: '{{\'APP_CLINIC\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        views: {
          'layout': {
            templateUrl: '../common/application/views/layout.html',
            controller: 'DashboardController'
          },
          'content@dashboard': {
            templateUrl: 'views/dashboard.html'
          }
        },
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
        templateUrl: 'views/patient-chart.html',
        controller: 'PatientChartController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CHARTS\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      // TODO: check if in use
      .state('dashboard.actual', {
        url: '/actual',
        templateUrl: 'views/patient-actual.html',
        controller: 'PatientActualController'
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
        views: {
          'layout': {
            templateUrl: '../common/application/views/layout.html',
            controller: 'DetailPatientController',
            controllerAs: 'patientCommon'
          },
          'content@detailpatient': {
            templateUrl: '../patient-details/views/patient-details.html'
          }
        },
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
