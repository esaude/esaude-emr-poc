'use strict';

angular
    .module('home', ['ngRoute', 'ngCookies', 'ui.router', 'application', 'chart.js', 'bahmni.common.uiHelper', 
                'bahmni.common.appFramework', 'bahmni.common.domain'])
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
                function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login?showLoginMessage',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'LoginController'},
                    'content@login': { templateUrl: 'views/login.html'}
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                }
            });
    }]);
