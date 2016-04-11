'use strict';

angular
    .module('home')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login?showLoginMessage',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'LoginController'},
                    'content@login': { templateUrl: 'views/login.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                }
            });
            $bahmniTranslateProvider.init({app: 'home', shouldMerge: true});
    }]);
