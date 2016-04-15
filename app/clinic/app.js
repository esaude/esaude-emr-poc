'use strict';

angular
    .module('clinic')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider) {
        $urlRouterProvider.otherwise('/search');
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
            .state('dashboard.summary', {
                url: '/summary',
                templateUrl: 'views/patient-summary.html', 
                controller: 'PatientSummaryController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.chart', {
                url: '/chart',
                templateUrl: 'views/patient-chart.html',
                controller: 'PatientChartController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.consultation', {
                url: '/consultation',
                templateUrl: 'views/patient-consultation.html',
                resolve: { initialization: 'initialization' }
            });
            $bahmniTranslateProvider.init({app: 'clinical', shouldMerge: true});
    }]);