'use strict';

angular
    .module('vitals')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider) {
//        $urlRouterProvider.otherwise('/search');
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('search');
        });
        
        $stateProvider
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
            $bahmniTranslateProvider.init({app: 'vitals', shouldMerge: true});
    }]);