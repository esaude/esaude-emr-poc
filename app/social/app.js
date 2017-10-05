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
      var localStorageService = $injector.get('localStorageService');
      var movingPatient = localStorageService.get('movingPatient');
      var $state = $injector.get('$state');

      if (movingPatient !== null) {
        $state.go('mvp');
      } else {
        $state.go('search');
      }
    });

    $bahmniTranslateProvider.init({app: 'social', shouldMerge: true});

    $stateProvider
      .state('mvp', {
        views: {
          'layout': {
            template: '<div id="overlay"><div></div></div>',
            controller: 'MovePatientController'
          }
        },
        resolve: {
          initialization: 'initialization'
        }
      })
      .state('search', {
        url: '/search',
        views: {
          'layout': {
            templateUrl: '../common/application/views/layout.html',
            controller: 'SearchController'
          },
          'content@search': {
            templateUrl: 'views/search.html'
          }
        },
        resolve: {
          initialization: 'initialization'
        },
        ncyBreadcrumb: {
          label: '{{\'APP_SOCIAL\' | translate}} /  {{\'SEARCH_PATIENT\' | translate}}'
        }
      })
      .state('dashboard', {
        url: '/dashboard/:patientUuid',
        views: {
          'layout': {
            templateUrl: '../common/application/views/layout.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
          },
          'content@dashboard': {
            templateUrl: 'views/dashboard.html'
          }
        },
        resolve: {
          initialization: 'initialization',
          clinicalServicesService: function (clinicalServicesService) {
            return clinicalServicesService.init('social');
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'COMMON_DASHBOARD\' | translate}}',
          parent: 'search'
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
