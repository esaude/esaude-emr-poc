'use strict';

angular
    .module('clinic')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {
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

        $stateProvider
            .state('mvp', {
                views: {
                    'layout': { template: '<div id="overlay"><div></div></div>', controller: 'MovePatientController'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('search', {
                url: '/search',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'SearchController'},
                    'content@search': { templateUrl: 'views/search.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard', {
                url: '/dashboard/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.summary', {
                url: '/summary',
                templateUrl: 'views/patient-summary.html',
                controller: 'PatientSummaryController',
                controllerAs: 'vm',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.chart', {
                url: '/chart',
                templateUrl: 'views/patient-chart.html',
                controller: 'PatientChartController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.actual', {
                url: '/actual',
                templateUrl: 'views/patient-actual.html',
                controller: 'PatientActualController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.prescriptions', {
                url: '/prescription',
                templateUrl: '../common/prescription/views/patient-simplified-prescriptions.html',
                controller: 'PatientSimplifiedPrescriptionController',
                controllerAs: 'vm',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.consultation', {
                url: '/consultation',
                templateUrl: 'views/patient-consultation.html',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.current', {
              url: '/current',
              templateUrl: 'views/patient-current.html',
              controller: 'PatientCurrentController',
              resolve: { initialization: 'initialization' }
            })
            .state('detailpatient', {
              url: '/patient/detail/:patientUuid',
              views: {
                'layout': {
                  templateUrl: '../common/application/views/layout.html',
                  controller: 'DetailPatientController',
                  controllerAs: 'vm'
                },
                'content@detailpatient': {templateUrl: '../patient-details/views/patient-details.html'}
              },
              resolve: {initialization: 'initialization'}
            })
            .state('detailpatient.demographic', {
                url: '/demographic',
                templateUrl: '../patient-details/views/patient-demographics.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.addresses', {
                url: '/addresses',
                templateUrl: '../patient-details/views/patient-addresses.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.attributes', {
                url: '/attributes',
                templateUrl: '../patient-details/views/patient-attributes.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.identifiers', {
                url: '/identifiers',
                templateUrl: '../patient-details/views/patient-identifiers.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.death', {
                url: '/death',
                templateUrl: '../patient-details/views/patient-death.html',
                resolve: { initialization: 'initialization' }
            });

            $stateProviderRef = $stateProvider;
            $bahmniTranslateProvider.init({app: 'clinical', shouldMerge: true});
    }]);
