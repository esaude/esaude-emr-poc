'use strict';

angular
    .module('home', ['ngRoute', 'ui.router', 'application', 'chart.js'])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                }
            })
    }]);