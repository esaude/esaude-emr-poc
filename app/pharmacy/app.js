'use strict';

angular
    .module('pharmacy')
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
            .state('dashboard.filaHistory', {
                url: '/fila-history',
                templateUrl: 'views/fila-history.html',
                controller: 'FilaHistoryController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.dispensationHistory', {
                url: '/dispensation-history',
                templateUrl: 'views/dispensation-history.html',
                controller: 'DispensationHistoryController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.dispensation', {
                url: '/dispensation',
                templateUrl: 'views/dispensation.html',
                controller: 'DispensationController',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient', {
                url: '/patient/detail/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DetailPatientController'},
                    'content@detailpatient': { templateUrl: '../patient-details/views/patient-details.html'}
                },
                resolve: { initialization: 'initialization' }
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
            $bahmniTranslateProvider.init({app: 'pharmacy', shouldMerge: true});
    }]);