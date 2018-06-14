(function () {
  'use strict';

  angular
    .module('registration')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider'];

  /* @ngInject */
  function config ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {

    // to prevent the browser from displaying a password pop-up in case of an authentication error
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';

    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('search');
    });

    $bahmniTranslateProvider.init({app: 'registration', shouldMerge: true});

    $stateProvider
      .state('search', {
        url: '/search',
        component: 'patientSearch',
        resolve: {
          initialization: 'initialization',
          showSchedule: function () { return true; },
          createPatient: function () { return true; },
        },
        ncyBreadcrumb: {
          label: '{{\'APP_REGISTRATION\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        component: 'dashboard',
        resolve: {
          initialization: 'initialization',
          patient: function(initialization, $stateParams, patientService) {
            return patientService.getPatient($stateParams.patientUuid);
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
        }
      })
      .state('dashboard.program', {
        url: '/program',
        templateUrl: '../common/uicontrols/programmanagement/views/patient-programs.html',
        controller: 'ManageProgramController',
        ncyBreadcrumb: {
          label: '{{\'COMMON_PROGRAM_ENROLLMENT_TITLE\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      .state('dashboard.visits', {
        url: '/visits',
        component: 'visitHistory',
        ncyBreadcrumb: {
          label: '{{\'COMMON_VISIT_HISTORY_TITLE\' | translate}}',
          parent: 'dashboard',
          skip: true
        }
      })
      .state('dashboard.services', {
        url: '/services',
        component: 'clinicalServices',
        ncyBreadcrumb: {
          label: '{{\'COMMON_CLINIC_SERVICES_TITLE\' | translate}}',
          parent: 'dashboard',
          skip: true
        },
        resolve: {
          clinicalServicesService: function (clinicalServicesService, patient) {
            return clinicalServicesService.init('registration', patient.uuid);
          }
        }
      })
      // TODO move newpatient and editpatient routes to common.patient modules after route based authorization is done.
      .state('newpatient', {
        url: '/patient/new',
        component: 'patientWizard',
        resolve: {
          initialization: 'initialization',
          patient: function(patient) {
            return patient.create();
          }
        },
        ncyBreadcrumb: {
          label: '{{\'PATIENT_INFO_NEW\' | translate}}',
          parent: 'search'
        }
      })
      .state('newpatient.name', {
        url: '/name',
        component: 'patientNamesStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.gender', {
        url: '/gender',
        component: 'patientGenderStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.age', {
        url: '/age',
        component: 'patientAgeStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.address', {
        url: '/address',
        component: 'patientAddressStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.other', {
        url: '/other',
        component: 'patientOtherStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.identifier', {
        url: '/identifier',
        component: 'patientIdentifiersStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.testing', {
        url: '/testing',
        component: 'patientHIVTestStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('newpatient.confirm', {
        url: '/confirm',
        component: 'patientConfirmStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient', {
        url: '/patient/edit/:patientUuid',
        component: 'patientWizard',
        ncyBreadcrumb: {
          label: '{{\'EDIT_PATIENT\' | translate }}',
          parent: 'dashboard'
        },
        params: {
          returnState: null
        },
        resolve: {
          initialization: 'initialization',
          patient: function (initialization, $stateParams, patientService, patientRepresentation) {
            // We need initialization to always resolve first';
            return patientService.getPatient($stateParams.patientUuid, patientRepresentation);
          }
        }
      })
      .state('editpatient.name', {
        url: '/name',
        component: 'patientNamesStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.gender', {
        url: '/gender',
        component: 'patientGenderStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.age', {
        url: '/age',
        component: 'patientAgeStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.address', {
        url: '/address',
        component: 'patientAddressStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.other', {
        url: '/other',
        component: 'patientOtherStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.identifier', {
        url: '/identifier',
        component: 'patientIdentifiersStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.testing', {
        url: '/testing',
        component: 'patientHIVTestStep',
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('editpatient.confirm', {
        url: '/confirm',
        component: 'patientConfirmStep',
        ncyBreadcrumb: {
          skip: true
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
