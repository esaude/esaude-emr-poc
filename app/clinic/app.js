'use strict';

angular
    .module('clinic')
    .config(['$urlRouterProvider', '$stateProvider', 
                function ($urlRouterProvider, $stateProvider) {
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
            });
    }]);