(() => {
  'use strict';

  angular
    .module('clinic')
    .config(config);

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
    $urlRouterProvider.otherwise($injector => {
      $injector.get('$state').go('search');
    });

    const CLINIC_APP_ID = 'clinic';

    $bahmniTranslateProvider.init({ app: CLINIC_APP_ID, shouldMerge: true });

    $stateProvider
      .state('root', {
        abstract: true,
        data: {authorization: CLINIC_APP_ID},
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
          scheduleType: () => 'currentProvider',
        },
        ncyBreadcrumb: {
          label: '{{\'APP_CLINIC\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        parent: 'root',
        resolve: {
          patient: ($stateParams, initialization, patientService) => {
            // initialization should resolve first because of openmrs patient mapper needs to load patient attributes
            // config
            return patientService.getPatient($stateParams.patientUuid);
          }
        },
        ncyBreadcrumb: {
          label: '{{\'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        }
      })
      .state('dashboard.summary', {
        url: '/summary',
        component: 'patientSummary',
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
        component: 'prescription',
        resolve: {
          patient: ($stateParams, initialization, patientService) => patientService.getPatient($stateParams.patientUuid)
        },
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
        component: 'patientConsultation',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CONSULTATION\' | translate}}',
          parent: 'dashboard',
          skip: true
        },
        resolve: {
          clinicalServicesService: (clinicalServicesService, $stateParams) => clinicalServicesService.init(CLINIC_APP_ID, $stateParams.patientUuid)
        }
      })
      .state('dashboard.current', {
        url: '/current',
        component: 'patientCurrent',
        ncyBreadcrumb: {
          label: '{{\'CLINIC_PATIENT_CURRENT_STATUS\' | translate}}',
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
